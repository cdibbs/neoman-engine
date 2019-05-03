import { RunOptions, TemplateContentFile } from "../models";
import { ITemplate } from "../i";
import { Observable } from "rxjs";

export interface ITreeTransformer {
    register(
        source: Observable<TemplateContentFile>,
        tmpl: ITemplate,
        inputs: { [key: string]: any },
        options?: RunOptions
    ): Observable<TemplateContentFile>;
}