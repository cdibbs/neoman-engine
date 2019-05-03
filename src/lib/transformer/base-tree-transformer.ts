import { inject, injectable } from 'inversify';
import TYPES from '../di/types';
import { IUserMessager, ITemplate } from "../i";
import { RunOptions, TemplateContentFile } from "../models";
import { IPathTransformManager, ITransformManager } from "../transformers/i";
import { Verbosity } from '../types/verbosity';
import { curry } from '../util/curry';
import { PathTransforms, Transforms } from '../user-extensibility/template';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ITreeTransformer } from './i-tree-transformer';

@injectable()
export abstract class BaseTreeTransformer implements ITreeTransformer {
    public constructor(
        @inject(TYPES.UserMessager) protected msg: IUserMessager,
        @inject(TYPES.PathTransformManager) protected pathTransformManager: IPathTransformManager,
        @inject(TYPES.TransformManager) protected transformManager: ITransformManager
    ) {

    }

    public register(
        source: Observable<TemplateContentFile>,
        tmpl: ITemplate,
        inputs: { [key: string]: any },
        options: RunOptions = new RunOptions()
    ): Observable<TemplateContentFile> {
        this.transformManager.configure(tmpl, inputs);
        this.pathTransformManager.configure(tmpl, inputs);
        const transformer = curry.threeOf4(
            this.transform,
            this,
            tmpl.pathTransform,
            tmpl.transform,
            options.verbosity);
        return source.pipe(mergeMap(transformer));
    }

    protected abstract transform(
        pathTransforms: PathTransforms,
        transforms: Transforms,
        verbosity: Verbosity,
        discovery: TemplateContentFile
    ): Promise<TemplateContentFile>;
}