import { TemplateFilesEmitterType } from "../emitters";
import { IEventEmitter } from "../emitters/i";
import { ITemplateFile, IUserMessager, ITemplate } from "../i";
import { RunOptions } from "../models";
import { IPathTransformManager, ITransformManager } from "../transformers/i";
import { Verbosity } from '../types/verbosity';
import { ITreeDiscoveryEventHandler } from "./i";
import { PathTransforms, Transforms } from '../user-extensibility/template';
export declare abstract class BaseTreeDiscoveryHandler implements ITreeDiscoveryEventHandler {
    protected msg: IUserMessager;
    protected pathTransformManager: IPathTransformManager;
    protected transformManager: ITransformManager;
    constructor(msg: IUserMessager, pathTransformManager: IPathTransformManager, transformManager: ITransformManager);
    register(source: IEventEmitter<TemplateFilesEmitterType>, output: IEventEmitter<TemplateFilesEmitterType>, tmpl: ITemplate, options: RunOptions, inputs: {
        [key: string]: any;
    }): void;
    protected abstract matchTmplFile(output: IEventEmitter<TemplateFilesEmitterType>, pathTransforms: PathTransforms, transforms: Transforms, verbosity: Verbosity, tmplFile: ITemplateFile): void;
    protected tentativeMatchTmplFile(output: IEventEmitter<TemplateFilesEmitterType>, verbosity: Verbosity, tmplFile: ITemplateFile): void;
    protected excludeMatchTmplFile(tmplFile: ITemplateFile): void;
    protected templateError(err: Error): void;
}
