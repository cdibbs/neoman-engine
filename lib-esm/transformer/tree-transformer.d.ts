import { BaseTreeTransformer } from "./base-tree-transformer";
import { IUserMessager } from "../i";
import { PathTransforms, Transforms } from "../user-extensibility";
import { Verbosity } from '../types/verbosity';
import { TemplateContentFile } from "../models/template-content-file";
import { ITransformManager, IPathTransformManager } from "../transformers/i";
import { Mapper } from "../mapper";
import { ITemplateContentFile } from "../i/i-template-content-file";
export declare class TreeTransformer extends BaseTreeTransformer {
    protected msg: IUserMessager;
    protected pathTransformManager: IPathTransformManager;
    protected transformManager: ITransformManager;
    protected mapper: Mapper;
    constructor(msg: IUserMessager, pathTransformManager: IPathTransformManager, transformManager: ITransformManager, mapper: Mapper);
    protected transform(pathTransforms: PathTransforms, contentTransforms: Transforms, verbosity: Verbosity, discovery: TemplateContentFile): Promise<TemplateContentFile>;
    protected contentBuilder(transforms: Transforms, tmplFile: ITemplateContentFile): Promise<string>;
}
