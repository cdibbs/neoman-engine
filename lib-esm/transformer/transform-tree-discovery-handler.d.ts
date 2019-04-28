import { BaseTreeDiscoveryHandler } from "./base-tree-discovery-handler";
import { IEventEmitter, TemplateContentFilesEmitterType } from "../emitters";
import { IUserMessager, IPath } from "../i";
import { PathTransforms, Transforms } from "../user-extensibility";
import { Verbosity } from '../types/verbosity';
import { ITransformManager, IPathTransformManager } from "../transformers/i";
import { Mapper } from "../mapper";
import { ITemplateContentFile } from "../i/i-template-content-file";
export declare class TransformTreeDiscoveryHandler extends BaseTreeDiscoveryHandler {
    protected msg: IUserMessager;
    protected pathTransformManager: IPathTransformManager;
    protected transformManager: ITransformManager;
    protected path: IPath;
    protected mapper: Mapper;
    constructor(msg: IUserMessager, pathTransformManager: IPathTransformManager, transformManager: ITransformManager, path: IPath, mapper: Mapper);
    protected matchTmplFile(output: IEventEmitter<TemplateContentFilesEmitterType>, pathTransforms: PathTransforms, contentTransforms: Transforms, verbosity: Verbosity, tmplFile: ITemplateContentFile): Promise<void>;
    protected contentBuilder(transforms: Transforms, tmplFile: ITemplateContentFile): Promise<string>;
}
