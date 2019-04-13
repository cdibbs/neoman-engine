export interface IRegexer {
    transform(
        source: string,
        pattern: string,
        replace: string,
        mods: { [key: string]: (i: string) => string }
    ): string;
}