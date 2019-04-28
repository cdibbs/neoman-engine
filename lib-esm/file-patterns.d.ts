import * as i from './i';
export declare class FilePatterns implements i.IFilePatterns {
    readonly _isMatch: any;
    match(path: string, patterns: string[]): string[];
    isMatch(path: string, pattern: string): boolean;
}
