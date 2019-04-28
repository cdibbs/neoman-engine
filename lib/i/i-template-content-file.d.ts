import { ITemplateFile } from "../i";
export interface ITemplateContentFile extends ITemplateFile {
    hasContents: boolean;
    getContents(): Promise<string>;
}
