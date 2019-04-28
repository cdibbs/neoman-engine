import { IRegexer } from "./i-regexer";
export declare type ReplacerModCallbackFn = (pi: string, match: string, pn: string[], offset: number, whole: string) => string;
export declare class Regexer implements IRegexer {
    constructor();
    transform(source: string, pattern: string, replace: string, mods: {
        [key: string]: (i: string) => string;
    }): string;
    protected replacer(replacement: string, mods: {
        [key: string]: ReplacerModCallbackFn;
    }, match: string, /* corresponds to "$&" */ ...pn: string[]): string;
    protected getModResultsDict(mods: {
        [key: string]: ReplacerModCallbackFn;
    }, match: string, /* corresponds to "$&" */ pn: string[], /* correspond to $1, $2... */ offset: number, whole: string): {
        [key: string]: string;
    };
}
