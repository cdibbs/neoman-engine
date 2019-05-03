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
let PathTransformManager = class PathTransformManager extends BaseTransformManager {
    constructor(filePatterns, msg) {
        super(filePatterns, msg);
    }
    async applyTransforms(path, tdef) {
        if (typeof tdef === "undefined") {
            return path;
        }
        else if (tdef instanceof Array) {
            return this.transformAll(path, tdef);
        }
        else if (typeof tdef === "string") { // simple regexp?
            return this.transformAll(path, [this.regexToTransform(tdef)]);
        }
        else if (typeof tdef === "object") { // single replacement? treat as rdef
            return this.transformAll(path, [tdef]);
        }
        throw new Error(`Replace definition not understood. Type found: ${typeof tdef}.`);
    }
    async transformAll(path, transforms) {
        let processing = path;
        for (let i = 0; i < transforms.length; i++) {
            let t = transforms[i];
            if (typeof t === "string") {
                t = this.regexToTransform(t);
            }
            if (typeof t === "object") {
                processing = await this.transformOne(processing, t, i);
            }
            else {
                throw new Error(`I do not understand format of path transform #${i + 1}, type ${typeof t}.`);
            }
        }
        return processing;
    }
    async transformOne(processing, t, i) {
        let check = this.replaceDoesApply(processing, t.files, t.ignore, t.using);
        if (check.matches) {
            processing = await this.applyIfMatch(t, processing, i);
        }
        else {
            this.msg.i18n({ i, subject: t.subject }).debug('Skipping path transform def #{i}, "{subject}" (no match: config or globs).', 2);
        }
        return processing;
    }
    async applyIfMatch(t, path, i) {
        if (path.match(t.subject)) {
            this.msg.i18n({ subject: t.subject }).debug('Applying path transform for "{subject}".', 2);
            path = await this.applyReplace(path, t, path);
            this.msg.i18n({ path }).debug('Int. result: {path}', 3);
        }
        else {
            this.msg.i18n({ i, subject: t.subject }).debug('Skipping path transform def #{i} (no match: "{subject}").', 2);
        }
        return path;
    }
};
PathTransformManager = __decorate([
    injectable(),
    __param(0, inject(TYPES.FilePatterns)),
    __param(1, inject(TYPES.UserMessager)),
    __metadata("design:paramtypes", [Object, Object])
], PathTransformManager);
export { PathTransformManager };
//# sourceMappingURL=path-transform-manager.js.map