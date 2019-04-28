import { TemplateContentFilesEmitterType } from '../emitters';
import { IEventEmitter } from '../emitters/i';
import { RunOptions } from '../models';
import { ITemplate } from './i-template';
export interface ITemplateRunner {
    /**
     * Transforms a stream of files according to a template definition.
     * @param tmpl The template definition to run.
     * @param source An emitter for a stream of files.
     * @param options Any provided run options (or their defaults).
     * @param userInputs User-provided inputs gathered for this template.
     * @returns An emitter for a stream of transformed paths and files.
     */
    run(tmpl: ITemplate, source: IEventEmitter<TemplateContentFilesEmitterType>, options: RunOptions, userInputs: {
        [key: string]: any;
    }): IEventEmitter<TemplateContentFilesEmitterType>;
}
