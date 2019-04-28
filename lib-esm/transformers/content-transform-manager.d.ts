import { IFilePatterns, IUserMessager } from '../i';
import { RuleMatchResult } from '../models';
import { ITransform, Transforms } from '../user-extensibility/template';
import { BaseTransformManager } from './base-transform-manager';
import { ITransformManager } from './i';
export declare class ContentTransformManager extends BaseTransformManager implements ITransformManager {
    constructor(filePatterns: IFilePatterns, msg: IUserMessager);
    applyTransforms(path: string, content: string, rdef: Transforms): Promise<string>;
    replaceInFile(path: string, content: string, rdefs: ITransform[] | string[]): Promise<string>;
    replaceOne(path: string, content: string, rdef: ITransform): Promise<string>;
    protected displaySkipReason(msgCtxt: IUserMessager, check: RuleMatchResult): void;
    protected formatSource(rdef: ITransform): string;
}
