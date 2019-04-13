export interface ITemplateFile {
    relativePath: string;
    absolutePath: string;
    isDirectory: boolean;
    size: number;
    includedBy?: string[];
    excludedBy?: string[];
}