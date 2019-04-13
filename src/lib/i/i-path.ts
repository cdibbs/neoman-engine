
/**
 * The subset of path features we use.
 */
export interface IPath {
    sep: string;
    join(...parts: string[]): string;
    dirname(path: string): string;
    resolve(path: string): string;
}