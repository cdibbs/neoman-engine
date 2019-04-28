import { BaseTransformManager } from './base-transform-manager';
import { TemplateConfiguration } from './models/configuration';
import { IPathTransformManager } from './i';
import { IFilePatterns, IUserMessager } from '../i';
import { PathTransforms, IPathTransform } from '../user-extensibility/template';
export declare class PathTransformManager extends BaseTransformManager implements IPathTransformManager {
    configs: {
        [key: string]: TemplateConfiguration;
    };
    inputs: {
        [key: string]: any;
    };
    constructor(filePatterns: IFilePatterns, msg: IUserMessager);
    applyTransforms(path: string, tdef: PathTransforms): Promise<string>;
    transformAll(path: string, transforms: IPathTransform[] | string[]): Promise<string>;
    transformOne(processing: string, t: IPathTransform, i: number): Promise<string>;
    applyIfMatch(t: IPathTransform, path: string, i: number): Promise<string>;
}
