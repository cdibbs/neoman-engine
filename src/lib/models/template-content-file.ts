import { ITemplateContentFile } from "../i/i-template-content-file";
import { ITemplateFile } from "../i";

export class TemplateContentFile implements ITemplateContentFile {
    public relativePath: string = null;
    public absolutePath: string = null;
    public isDirectory: boolean = false;
    public size: number = 0;
    public includedBy: string[] = [];
    public excludedBy: string[] = [];

    hasContents: boolean = false;
    getContents: () => Promise<string> = () => Promise.reject("Never initialized.");
}