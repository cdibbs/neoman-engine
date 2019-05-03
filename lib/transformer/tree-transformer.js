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
import { BaseTreeTransformer } from "./base-tree-transformer";
import { TemplateContentFile } from "../models/template-content-file";
import { inject, injectable } from "inversify";
import TYPES from "../di/types";
import { Mapper } from "../mapper";
import { curry } from "../util";
let NestedError = require('nested-error-stacks');
let TreeTransformer = class TreeTransformer extends BaseTreeTransformer {
    constructor(msg, pathTransformManager, transformManager, mapper) {
        super(msg, pathTransformManager, transformManager);
        this.msg = msg;
        this.pathTransformManager = pathTransformManager;
        this.transformManager = transformManager;
        this.mapper = mapper;
    }
    async transform(pathTransforms, contentTransforms, verbosity, discovery) {
        try {
            this.msg.i18n({ absPath: discovery.absolutePath }).debug("Include: {absPath}");
            const transformed = this.mapper.map(discovery, TemplateContentFile, { ignore: ["getContents"] });
            transformed.hasContents = true;
            transformed.getContents = curry.twoOf2(this.contentBuilder, this, contentTransforms, discovery);
            this.msg.i18n({ absPath: discovery.absolutePath })
                .info("Transforming path '{absPath}'...");
            transformed.relativePath = await this.pathTransformManager.applyTransforms(discovery.relativePath, pathTransforms);
            return transformed;
        }
        catch (ex) {
            const msg = this.msg
                .i18n({ path: discovery.absolutePath })
                .mf("Unexpected error while transforming '{path}'.");
            throw new NestedError(msg, ex);
        }
    }
    async contentBuilder(transforms, tmplFile) {
        try {
            this.msg.i18n().debug(`Applying content transforms...`, 1);
            const content = await tmplFile.getContents();
            return await this.transformManager.applyTransforms(tmplFile.relativePath, content, transforms);
        }
        finally {
            this.msg.i18n().debug('Done.', 1);
        }
    }
};
TreeTransformer = __decorate([
    injectable(),
    __param(0, inject(TYPES.UserMessager)),
    __param(1, inject(TYPES.PathTransformManager)),
    __param(2, inject(TYPES.TransformManager)),
    __param(3, inject(TYPES.Mapper)),
    __metadata("design:paramtypes", [Object, Object, Object, Mapper])
], TreeTransformer);
export { TreeTransformer };
//# sourceMappingURL=tree-transformer.js.map