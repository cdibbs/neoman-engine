import { IUserMessager, ITemplate } from "../i";
import { RunOptions, TemplateContentFile } from "../models";
import { IPathTransformManager, ITransformManager } from "../transformers/i";
import { Verbosity } from '../types/verbosity';
import { PathTransforms, Transforms } from '../user-extensibility/template';
import { Observable } from 'rxjs';
import { ITreeTransformer } from './i-tree-transformer';
export declare abstract class BaseTreeTransformer implements ITreeTransformer {
    protected msg: IUserMessager;
    protected pathTransformManager: IPathTransformManager;
    protected transformManager: ITransformManager;
    constructor(msg: IUserMessager, pathTransformManager: IPathTransformManager, transformManager: ITransformManager);
    register(source: Observable<TemplateContentFile>, tmpl: ITemplate, inputs: {
        [key: string]: any;
    }, options?: RunOptions): Observable<TemplateContentFile>;
    protected abstract transform(pathTransforms: PathTransforms, transforms: Transforms, verbosity: Verbosity, include: string[], ignore: string[], discovery: TemplateContentFile): Promise<TemplateContentFile>;
}
