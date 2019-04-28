import { BaseTreeTransformer } from "./base-tree-transformer";
import { IUserMessager } from "../i";
import { PathTransforms, Transforms } from "../user-extensibility";
import { Verbosity } from '../types/verbosity';
import { ITransformManager, IPathTransformManager } from "../transformers/i";
import { Mapper } from "../mapper";
import { Discovery } from "../models";
import { ITemplateContentFile } from "../i/i-template-content-file";
import { Transform } from "../models/transform";
export declare class TreeTransformer extends BaseTreeTransformer {
    protected msg: IUserMessager;
    protected pathTransformManager: IPathTransformManager;
    protected transformManager: ITransformManager;
    protected mapper: Mapper;
    constructor(msg: IUserMessager, pathTransformManager: IPathTransformManager, transformManager: ITransformManager, mapper: Mapper);
    protected transform(pathTransforms: PathTransforms, contentTransforms: Transforms, verbosity: Verbosity, discovery: Discovery): Promise<Transform>;
    protected contentBuilder(transforms: Transforms, tmplFile: ITemplateContentFile): Promise<string>;
}
