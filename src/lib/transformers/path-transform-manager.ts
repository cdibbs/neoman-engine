import { inject, injectable } from 'inversify';
import TYPES from '../di/types';
import { IPluginManager } from '../plugin-manager/i-plugin-manager';
import { BaseTransformManager } from './base-transform-manager';
import { TemplateConfiguration } from './models/configuration';
import { IPathTransformManager } from './i';
import { IFilePatterns, IUserMessager, IHandlerService } from '../i';
import { PathTransforms, IPathTransform } from '../user-extensibility/template';
let requireg = require('requireg');


@injectable()
export class PathTransformManager extends BaseTransformManager implements IPathTransformManager{
    configs: { [key: string]: TemplateConfiguration };
    inputs: { [key: string]: any };

    constructor(
        @inject(TYPES.FilePatterns) filePatterns: IFilePatterns,
        @inject(TYPES.UserMessager) msg: IUserMessager,
        @inject(TYPES.HandlerService) hnd: IHandlerService,
        @inject(TYPES.PluginManager) protected plugMgr: IPluginManager
    ) {
        super(filePatterns, msg, hnd, plugMgr);
    }

    async applyTransforms(path: string, tdef: PathTransforms): Promise<string> {
        if (typeof tdef === "undefined") {
            return path;
        } else if (tdef instanceof Array) {
            return this.transformAll(path, <IPathTransform[]>tdef);
        } else if (typeof tdef === "string") { // simple regexp?
            return this.transformAll(path, [this.regexToTransform<IPathTransform>(tdef)]);
        } else if (typeof tdef === "object") { // single replacement? treat as rdef
            return this.transformAll(path, [tdef]);
        }

        throw new Error(`Replace definition not understood. Type found: ${typeof tdef}.`);
    }

    async transformAll(path: string, transforms: IPathTransform[] | string[]): Promise<string> {
        let processing = path;

        for (let i=0; i<transforms.length; i++) {
            let t = transforms[i];
            if (typeof t === "string") {              
                t = this.regexToTransform<IPathTransform>(t);
            }

            if (typeof t === "object") {
                processing = await this.transformOne(processing, t, i);
            } else {
                throw new Error(`I do not understand format of path transform #${i + 1}, type ${typeof t}.`);
            }
        }

        return processing;
    }

    async transformOne(processing: string, t: IPathTransform, i: number): Promise<string> {
        let check = this.replaceDoesApply(processing, t.files, t.ignore, t.using);
        if (check.matches) {
            processing = await this.applyIfMatch(t, processing, i);
        } else {
            this.msg.i18n({i, subject: t.subject}).debug('Skipping path transform def #{i}, "{subject}" (no match: config or globs).', 2);
        }

        return processing;
    }

    async applyIfMatch(t: IPathTransform, path: string, i: number): Promise<string> {
        if (path.match(t.subject)) {
            this.msg.i18n({subject: t.subject}).debug('Applying path transform for "{subject}".', 2);
            path = await this.applyReplace(path, t, path);
            this.msg.i18n({path}).debug('Int. result: {path}', 3);
        } else {
            this.msg.i18n({i, subject: t.subject}).debug('Skipping path transform def #{i} (no match: "{subject}").', 2);
        }

        return path;
    }
}