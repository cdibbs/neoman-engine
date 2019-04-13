import { ITemplate } from "./i-template";

export interface ITemplateValidator {
    dependenciesInstalled(tmpl: ITemplate): { [key: string]: boolean };
}