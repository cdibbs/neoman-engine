import { IEventEmitter } from "../../emitters/i";
import { TemplateFilesEmitterType } from "../../emitters";
import { RunOptions } from "../../models";
import { ITemplate } from "../../i";

export interface ITreeDiscoveryEventHandler {
    register(emitter: IEventEmitter<TemplateFilesEmitterType>, destPath: string, tmpl: ITemplate, options: RunOptions,inputs: { [key: string]: any }): void;
}