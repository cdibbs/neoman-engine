export interface IFilePatterns {
    match(path: string, patterns: string[]): string[];
}