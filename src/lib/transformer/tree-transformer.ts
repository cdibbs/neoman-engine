import { BaseTreeTransformer } from "./base-tree-transformer";
import { IUserMessager } from "../i";
import { PathTransforms, Transforms } from "../user-extensibility";
import { Verbosity } from '../types/verbosity';
import { TemplateContentFile } from "../models/template-content-file";
import { inject, injectable } from "inversify";
import TYPES from "../di/types";
import { ITransformManager, IPathTransformManager } from "../transformers/i";
import { Mapper } from "../mapper";
import { curry } from "../util";
import { ITemplateContentFile } from "../i/i-template-content-file";
let NestedError = require('nested-error-stacks');

@injectable()
export class TreeTransformer extends BaseTreeTransformer {
    public constructor(
        @inject(TYPES.UserMessager) protected msg: IUserMessager,
        @inject(TYPES.PathTransformManager) protected pathTransformManager: IPathTransformManager,
        @inject(TYPES.TransformManager) protected transformManager: ITransformManager,
        @inject(TYPES.Mapper) protected mapper: Mapper
    ) {
        super(msg, pathTransformManager, transformManager);
    }

    protected async transform(
        pathTransforms: PathTransforms,
        contentTransforms: Transforms,
        verbosity: Verbosity,
        discovery: TemplateContentFile
    ): Promise<TemplateContentFile> {
        try {
            this.msg.i18n({absPath: discovery.absolutePath}).debug("Include: {absPath}");

            const transformed = this.mapper.map(
                discovery, TemplateContentFile, { ignore: [ "getContents" ] });
            transformed.hasContents = true;
            transformed.getContents = curry.twoOf2(this.contentBuilder, this, contentTransforms, discovery);

            this.msg.i18n({absPath: discovery.absolutePath})
                .info("Transforming path '{absPath}'...");
            transformed.relativePath = await this.pathTransformManager.applyTransforms(discovery.relativePath, pathTransforms);

            return transformed;
        } catch (ex) {
            const msg = this.msg
                .i18n({ path: discovery.absolutePath })
                .mf("Unexpected error while transforming '{path}'.");
            throw new NestedError(msg, ex);
        }
    }

    protected async contentBuilder(
        transforms: Transforms,
        tmplFile: ITemplateContentFile
    ): Promise<string> {
        try {
            this.msg.i18n().debug(`Applying content transforms...`, 1);
            const content = await tmplFile.getContents();
            return await this.transformManager.applyTransforms(tmplFile.relativePath, content, transforms);
        } finally {
            this.msg.i18n().debug('Done.', 1);
        }
    }
}