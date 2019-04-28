export interface IFilePatterns {
    match(path: string, patterns: string[]): string[];
    isMatch(path: string, pattern: string): boolean;
}
