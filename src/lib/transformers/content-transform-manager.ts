import { inject, injectable } from 'inversify';
import TYPES from '../di/types';
import { IFilePatterns, IHandlerService, IUserMessager } from '../i';
import { RuleMatchResult } from '../models';
import { IPluginManager } from '../plugin-manager/i-plugin-manager';
import { ITransform, Transforms } from '../user-extensibility/template';
import { BaseTransformManager } from './base-transform-manager';
import { ITransformManager } from './i';

@injectable()
export class ContentTransformManager extends BaseTransformManager implements ITransformManager{

    constructor(
        @inject(TYPES.FilePatterns) filePatterns: IFilePatterns,
        @inject(TYPES.UserMessager) msg: IUserMessager,
        @inject(TYPES.HandlerService) hnd: IHandlerService,
        @inject(TYPES.PluginManager) protected plugMgr: IPluginManager
    ) {
        super(filePatterns, msg, hnd, plugMgr);
    }

    async applyTransforms(path: string, content: string, rdef: Transforms): Promise<string> {
        if (typeof rdef === "undefined") {
            return content;
        } else if (rdef instanceof Array) {
            return this.replaceInFile(path, content, <ITransform[]>rdef);
        } else if (typeof rdef === "string") { // simple regexp
            return this.replaceInFile(path, content, [this.regexToTransform(rdef)]);
        } else if (typeof rdef === "object") { // single replacement? treat as rdef
            return this.replaceInFile(path, content, [rdef]);
        }

        throw new Error(`Replace definition not understood. Type found: ${typeof rdef}.`);
    }

    async replaceInFile(path: string, content: string, rdefs: ITransform[] | string[]): Promise<string> {
        for (let i=0; i<rdefs.length; i++) {
            let rdef = rdefs[i];
            if (typeof rdef === "string") {              
                rdef = this.regexToTransform(rdef);
            }
            
            if (typeof rdef === "object") {
                content = await this.replaceOne(path, content, rdef);
            } else {
                throw new Error(`Unrecognized replacement definition ${i}, type: ${typeof rdef}.`);
            }
        }

        return content;
    }

    async replaceOne(path: string, content: string, rdef: ITransform): Promise<string> {
        let src: string = this.formatSource(rdef);

        let msgCtxt = this.msg.i18n({subject: rdef.subject, src });

        let check = this.replaceDoesApply(path, rdef.files, rdef.ignore, rdef.using);
        if (check.matches) {
            msgCtxt.debug('Applying transform definition for "{subject}"{src}.', 2)
            content = await this.applyReplace(content, rdef, path);
        } else {
            let nest = msgCtxt.debug('Skipping transform definition for "{subject}"{src}.', 2);
            this.displaySkipReason(msgCtxt, check);
        }

        return content;
    }

    protected displaySkipReason(msgCtxt: IUserMessager, check: RuleMatchResult) {
        msgCtxt = msgCtxt.i18n({rules: check.rules});
        let reason = msgCtxt.mf(check.reason);
        msgCtxt = msgCtxt.i18n({reason, rulesSummary: (check.rules || []).join(', ') || "N/A" });
        msgCtxt.debug("Reason: {reason}");
        let nest = msgCtxt.debug("Rule(s): {rules}");

        if (check.nestedRuleMatchResult) {
            this.displaySkipReason(nest, check.nestedRuleMatchResult);
        }
    }

    protected formatSource(rdef: ITransform): string {
        let srcs = [];
        if (rdef.using) {
            srcs.push(`using: ${rdef.using}`);
        }
        
        if (rdef.with && rdef.with["handler"]) {
            srcs.push(`handler: ${rdef.with['handler']}`);
        }

        return srcs.length ? ' (' + srcs.join(', ') + ')' : '';
    }
}