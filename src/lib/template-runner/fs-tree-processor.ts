import { inject, injectable } from 'inversify';
let NestedError = require('nested-error-stacks');
import * as fse from 'fs-extra';

import TYPES from '../di/types';
import { IUserMessager, IPath, IFileSystem, ITemplateFile, IFilePatterns, ITemplate } from '../i';
import { IFSTreeProcessor, ITreeDiscoveryEventHandler } from "./i";
import { IEventEmitter } from "../emitters/i";
import { EventEmitter, TemplateFilesEmitterType } from '../emitters';
import { curry } from '../util/curry';
import { RunOptions, RunnerResult, CommandErrorType } from "../models";

@injectable()
export class FSTreeProcessor implements IFSTreeProcessor {
    public constructor(
        @inject(TYPES.UserMessager) private msgr: IUserMessager,
        @inject(TYPES.Path) private path: IPath,
        @inject(TYPES.FilePatterns) private patterns: IFilePatterns,
        @inject(TYPES.RealTreeDiscoveryHandler) private realTreeDiscoveryHandler: ITreeDiscoveryEventHandler,
        @inject(TYPES.SimulatedTreeDiscoveryHandler) private simulatedTreeDiscoveryHandler: ITreeDiscoveryEventHandler
    ) {

    }

    public async process(srcPath: string, destPath: string, options: RunOptions, inputs: { [key: string]: any }, tmpl: ITemplate): Promise<RunnerResult> {
        let emitter = new EventEmitter<TemplateFilesEmitterType>();
        let handler = options.simulate ? this.simulatedTreeDiscoveryHandler : this.realTreeDiscoveryHandler;
        handler.register(emitter, destPath, tmpl, options, inputs);
        return this.processDescendents(srcPath, srcPath, emitter, tmpl.files, tmpl.ignore);
    }

    protected async processDescendents(
        baseDir: string, 
        dir: string,
        emitter: IEventEmitter<TemplateFilesEmitterType>,
        include: string[] = [],
        ignore: string[] = []): Promise<RunnerResult>
    {
        try {
            let files = await this.readdir(dir);
            let resultsPromises = files.map(curry.fiveOf6(this.processFileInfo, this, baseDir, dir, include, ignore, emitter));
            let results = await Promise.all(resultsPromises);
            return results.reduce(this.combineResults, new RunnerResult());
        } catch (ex) {
            let message = this.msgr.i18n({dir}).mf('There was an unexpected error processing the file tree at {dir}.');
            emitter.emit('error', new NestedError(message, ex));
            return new RunnerResult(message, CommandErrorType.Exception, ex);
        }
    }

    protected async processFileInfo(
        baseDir: string,
        sourceDir: string,
        include: string[],
        ignore: string[],
        emitter: IEventEmitter<TemplateFilesEmitterType>,
        file: string): Promise<RunnerResult>
    {
        try {
            let p = this.path.join(sourceDir, file);
            let stats = await this.stat(p);
            let fileInfo = this.prepareFileInfo(baseDir, p, include, ignore, stats);
            return this.handleFileInfo(baseDir, p, include, ignore, emitter, fileInfo);
        } catch(ex) {
            let message = this.msgr.i18n({file}).mf('There was an unexpected error processing the file at {file}.');
            emitter.emit('error', new NestedError(message, ex));
            return new RunnerResult(message, CommandErrorType.Exception, ex);
        }
    }

    protected combineResults(a: RunnerResult, b: RunnerResult): RunnerResult {
        let c = new RunnerResult();
        c.totalFiles = (a.totalFiles || 0) + (b.totalFiles || 0);
        c.changed = (a.changed || 0) + (b.changed || 0);
        c.excluded = (a.excluded || 0) + (b.excluded || 0);
        c.processed = (a.processed || 0) + (b.processed || 0);
        c.totalChanges = (a.totalChanges || 0) + (b.totalChanges || 0);
        return c;
    }

    protected prepareFileInfo(
        baseDir: string,
        sourceFilePath: string,
        include: string[],
        ignore: string[],
        stat: fse.Stats): ITemplateFile
    {
        let relPath: string = sourceFilePath.substr(baseDir.length + 1);
        return <ITemplateFile>{
            absolutePath: sourceFilePath,
            relativePath: relPath,
            size: stat.size,
            isDirectory: stat.isDirectory(),
            includedBy: this.patterns.match(relPath, include),
            excludedBy: this.patterns.match(relPath, ignore)
        };
    }

    protected async handleFileInfo(
        baseDir: string,
        sourceFilePath: string,
        include: string[],
        ignore: string[],
        emitter: IEventEmitter<TemplateFilesEmitterType>,
        f: ITemplateFile): Promise<RunnerResult>
    {
        if (f.isDirectory) {
            if (f.excludedBy.length === 0) {
                emitter.emit('tentative', f);
                return this.processDescendents(baseDir, sourceFilePath, emitter, include, ignore);
                
            } else {
                emitter.emit('exclude', f);
                return <RunnerResult>{ excluded: 1, processed: 1 };
            }
        } else if (f.excludedBy.length === 0 && (f.includedBy.length > 0 || include.length === 0)) {
            emitter.emit('match', f);
            return <RunnerResult>{ totalFiles: 1, processed: 1 };
        }

        emitter.emit('exclude', f);
        return <RunnerResult>{ excluded: 1, processed: 1 };
    }

    // Testability FTW!
    protected readdir = fse.readdir;
    protected stat = fse.stat;
}