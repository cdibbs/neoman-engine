import * as fse from 'fs-extra';
import { inject, injectable } from 'inversify';
import TYPES from '../di/types';
import { TemplateFilesEmitterType } from "../emitters";
import { IEventEmitter } from "../emitters/i";
import { IFileSystem, IPath, ITemplateFile, IUserMessager, ITemplate } from "../i";
import { RunOptions } from "../models";
import { IPathTransformManager, ITransformManager } from "../transformers/i";
import { VERBOSITY, Verbosity } from '../types/verbosity';
import { curry } from '../util/curry';
import { ITreeDiscoveryEventHandler } from "./i";
import { PathTransforms, Transforms } from '../user-extensibility/template';

@injectable()
export abstract class BaseTreeDiscoveryHandler implements ITreeDiscoveryEventHandler {
    public constructor(
        @inject(TYPES.UserMessager) protected msg: IUserMessager,
        @inject(TYPES.PathTransformManager) protected pathTransformManager: IPathTransformManager,
        @inject(TYPES.TransformManager) protected transformManager: ITransformManager,
        @inject(TYPES.FS) protected fs: IFileSystem,
        @inject(TYPES.Path) protected path: IPath,
    ) {

    }

    public register(emitter: IEventEmitter<TemplateFilesEmitterType>, destPath: string, tmpl: ITemplate, options: RunOptions, inputs: { [key: string]: any }): void {
        this.transformManager.configure(tmpl, inputs);
        this.pathTransformManager.configure(tmpl, inputs);

        emitter.on('match', curry.fourOf5(this.matchTmplFile, this, destPath, tmpl.pathTransform, tmpl.transform, options.verbosity));
        emitter.on('tentative', curry.twoOf3(this.tentativeMatchTmplFile, this, destPath, options.verbosity));
        emitter.on('error', curry.bindOnly(this.templateError, this));
        if (options.verbosity === VERBOSITY.debug || options.showExcluded) {
            emitter.on('exclude', this.excludeMatchTmplFile.bind(this));
        }
    }

    protected abstract matchTmplFile(path: string, pathTransforms: PathTransforms, transforms: Transforms, verbosity: Verbosity, tmplFile: ITemplateFile): void;

    // directories not explicitly matched or excluded.
    protected tentativeMatchTmplFile(path: string, verbosity: Verbosity, tmplFile: ITemplateFile): void {
        if (verbosity === VERBOSITY.debug) {
            this.msg.i18n({relPath: tmplFile.relativePath})
                .debug('Tentative: {relPath}');
        }
    }

    protected excludeMatchTmplFile(tmplFile: ITemplateFile): void {
        this.msg.i18n({relPath: tmplFile.relativePath})
            .debug('Exclude: {relPath}');
    }    

    protected templateError(err: Error): void {
        this.msg.error(err.stack);
    }

    // facilitates testing.
    protected ensureDirSync = fse.ensureDirSync;
    protected readFileSync(path: string): Buffer { return fse.readFileSync(path); }
    protected writeFileSync(dest: string, content: any): void { return fse.writeFileSync(dest, content); }
}