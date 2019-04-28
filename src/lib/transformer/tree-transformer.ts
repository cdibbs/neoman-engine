import { BaseTreeTransformer } from "./base-tree-transformer";
import { IUserMessager, IPath } from "../i";
import { PathTransforms, Transforms } from "../user-extensibility";
import { Verbosity } from '../types/verbosity';
import { TemplateContentFile } from "../models/template-content-file";
import { inject } from "inversify";
import TYPES from "../di/types";
import { ITransformManager, IPathTransformManager } from "../transformers/i";
import { Mapper } from "../mapper";
import { curry } from "../util";
import { MapOption, Discovery } from "../models";
import { ITemplateContentFile } from "../i/i-template-content-file";
import { Transform } from "../models/transform";
let NestedError = require('nested-error-stacks');

export class TreeTransformer extends BaseTreeTransformer {
    public constructor(
        @inject(TYPES.UserMessager) protected msg: IUserMessager,
        @inject(TYPES.PathTransformManager) protected pathTransformManager: IPathTransformManager,
        @inject(TYPES.TransformManager) protected transformManager: ITransformManager,
        protected mapper: Mapper
    ) {
        super(msg, pathTransformManager, transformManager);
    }

    protected async transform(
        pathTransforms: PathTransforms,
        contentTransforms: Transforms,
        verbosity: Verbosity,
        discovery: Discovery
    ): Promise<Transform> {
        try {
            this.msg.i18n({absPath: discovery.file.absolutePath}).debug("Include: {absPath}");

            const transformed = this.mapper.map(
                discovery.file, TemplateContentFile, { exceptions: { "getContents": MapOption.Ignore } });
            transformed.hasContents = true;
            transformed.getContents = curry.twoOf2(this.contentBuilder, this, contentTransforms, discovery.file);

            this.msg.i18n({absPath: discovery.file.absolutePath})
                .info("Transforming path '{absPath}'...");
            transformed.relativePath = await this.pathTransformManager.applyTransforms(discovery.file.relativePath, pathTransforms);

            const t = new Transform();
            t.file = transformed;
            return t;
        } catch (ex) {
            const msg = this.msg
                .i18n({ path: discovery.file.absolutePath })
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