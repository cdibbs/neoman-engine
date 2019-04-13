import { IRawTemplate } from '../user-extensibility/template/i-raw-template';
import { IStrictRawTemplate } from '../user-extensibility/template/i-strict-raw-template';

/**
 * A preprocessed template, as used by Neoman internals. Does not
 * necessarily follow structure of template.json file. For that, see
 * files matching i*-raw-template.ts, or see the rawTemplate property,
 * in this file.
 */
export interface ITemplate extends IStrictRawTemplate {
    rawTemplate: IRawTemplate;

    /**
     * __tmplConfigPath joined with template.json's $.root specifier, if present.
     * This is the root directory where Neoman will look for files when
     * running the template. Will always be a directory.
     */
    __tmplPath: string;

    /**
     * The directory containing the .neoman.config folder.
     */
    __tmplConfigPath: string;


    /**
     * The template repository that contained this template.
     */
    __tmplRepo: string;
}