import { ITemplateContentFile } from "../i/i-template-content-file";
export declare class TemplateContentFile implements ITemplateContentFile {
    relativePath: string;
    absolutePath: string;
    isDirectory: boolean;
    size: number;
    includedBy: string[];
    excludedBy: string[];
    exclude: boolean;
    originalRelativePath: string;
    originalAbsolutePath: string;
    hasContents: boolean;
    getContents: () => Promise<string>;
}
