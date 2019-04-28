import { IUserMessager, ITemplate } from "../i";
import { RunOptions, Discovery } from "../models";
import { IPathTransformManager, ITransformManager } from "../transformers/i";
import { Verbosity } from '../types/verbosity';
import { PathTransforms, Transforms } from '../user-extensibility/template';
import { Observable } from 'rxjs';
import { ITreeTransformer } from './i-tree-transformer';
import { Transform } from '../models/transform';
export declare abstract class BaseTreeTransformer implements ITreeTransformer {
    protected msg: IUserMessager;
    protected pathTransformManager: IPathTransformManager;
    protected transformManager: ITransformManager;
    constructor(msg: IUserMessager, pathTransformManager: IPathTransformManager, transformManager: ITransformManager);
    register(source: Observable<Discovery>, tmpl: ITemplate, options: RunOptions, inputs: {
        [key: string]: any;
    }): Observable<Transform>;
    protected abstract transform(pathTransforms: PathTransforms, transforms: Transforms, verbosity: Verbosity, discovery: Discovery): Promise<Transform>;
}
