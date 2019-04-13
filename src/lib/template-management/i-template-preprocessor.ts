import { ITemplate } from "../i";

export interface ITemplatePreprocessor {
    preprocess(tmpl: ITemplate): ITemplate;
}