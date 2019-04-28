import { IEventEmitter } from "../../emitters/i";
import { TemplateFilesEmitterType } from "../../emitters";
import { RunOptions } from "../../models";
import { ITemplate } from "../../i";
export interface ITreeDiscoveryEventHandler {
    register(source: IEventEmitter<TemplateFilesEmitterType>, output: IEventEmitter<TemplateFilesEmitterType>, tmpl: ITemplate, options: RunOptions, inputs: {
        [key: string]: any;
    }): void;
}
