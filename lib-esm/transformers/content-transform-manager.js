var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { inject, injectable } from 'inversify';
import TYPES from '../di/types';
import { BaseTransformManager } from './base-transform-manager';
let ContentTransformManager = class ContentTransformManager extends BaseTransformManager {
    constructor(filePatterns, msg) {
        super(filePatterns, msg);
    }
    async applyTransforms(path, content, rdef) {
        if (typeof rdef === "undefined") {
            return content;
        }
        else if (rdef instanceof Array) {
            return this.replaceInFile(path, content, rdef);
        }
        else if (typeof rdef === "string") { // simple regexp
            return this.replaceInFile(path, content, [this.regexToTransform(rdef)]);
        }
        else if (typeof rdef === "object") { // single replacement? treat as rdef
            return this.replaceInFile(path, content, [rdef]);
        }
        throw new Error(`Replace definition not understood. Type found: ${typeof rdef}.`);
    }
    async replaceInFile(path, content, rdefs) {
        for (let i = 0; i < rdefs.length; i++) {
            let rdef = rdefs[i];
            if (typeof rdef === "string") {
                rdef = this.regexToTransform(rdef);
            }
            if (typeof rdef === "object") {
                content = await this.replaceOne(path, content, rdef);
            }
            else {
                throw new Error(`Unrecognized replacement definition ${i}, type: ${typeof rdef}.`);
            }
        }
        return content;
    }
    async replaceOne(path, content, rdef) {
        let src = this.formatSource(rdef);
        let msgCtxt = this.msg.i18n({ subject: rdef.subject, src });
        let check = this.replaceDoesApply(path, rdef.files, rdef.ignore, rdef.using);
        if (check.matches) {
            msgCtxt.debug('Applying transform definition for "{subject}"{src}.', 2);
            content = await this.applyReplace(content, rdef, path);
        }
        else {
            let nest = msgCtxt.debug('Skipping transform definition for "{subject}"{src}.', 2);
            this.displaySkipReason(msgCtxt, check);
        }
        return content;
    }
    displaySkipReason(msgCtxt, check) {
        msgCtxt = msgCtxt.i18n({ rules: check.rules });
        let reason = msgCtxt.mf(check.reason);
        msgCtxt = msgCtxt.i18n({ reason, rulesSummary: (check.rules || []).join(', ') || "N/A" });
        msgCtxt.debug("Reason: {reason}");
        let nest = msgCtxt.debug("Rule(s): {rules}");
        if (check.nestedRuleMatchResult) {
            this.displaySkipReason(nest, check.nestedRuleMatchResult);
        }
    }
    formatSource(rdef) {
        let srcs = [];
        if (rdef.using) {
            srcs.push(`using: ${rdef.using}`);
        }
        if (rdef.with && rdef.with["handler"]) {
            srcs.push(`handler: ${rdef.with['handler']}`);
        }
        return srcs.length ? ' (' + srcs.join(', ') + ')' : '';
    }
};
ContentTransformManager = __decorate([
    injectable(),
    __param(0, inject(TYPES.FilePatterns)),
    __param(1, inject(TYPES.UserMessager)),
    __metadata("design:paramtypes", [Object, Object])
], ContentTransformManager);
export { ContentTransformManager };
//# sourceMappingURL=content-transform-manager.js.map