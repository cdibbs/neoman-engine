import XRegExp = require("xregexp");
import { curry } from "./curry";
import { IRegexer } from "./i-regexer";

export type ReplacerModCallbackFn
    = (pi: string, match: string, pn: string[], offset: number, whole: string) => string;

export class Regexer implements IRegexer {
    constructor() {

    }

    public transform(
        source: string,
        pattern: string,
        replace: string,
        mods: { [key: string]: (i: string) => string }
    ): string
    {
        const regexp = XRegExp(pattern);
        const replacer = curry.twoOf4(this.replacer, this, replace, mods);
        return source.replace(regexp, replacer);
    }

    protected replacer(
        replacement: string,
        mods: { [key: string]: ReplacerModCallbackFn },
        match: string, /* corresponds to "$&" */
        ...pn: string[] /* correspond to $1, $2... */
    ): string
    {
        const offset = arguments[arguments.length - 2];
        const whole = arguments[arguments.length - 1];
        pn = pn.slice(0, -2);
        const results = this.getModResultsDict(mods, match, pn, offset, whole);
        const pieces = replacement.split(/(\$(?:\d{1,2}|\&|`|'|\$))/);
        if (pieces.length === 1) {
            // then no matches, return as is
            return replacement;
        }

        for (let i=0; i<pieces.length; i++) {
            if (pieces[i].substr(0, 1) === "$") {
                pieces[i] = results[pieces[i]];
            }
        }
        return pieces.join("");
    }

    protected getModResultsDict(
        mods: { [key: string]: ReplacerModCallbackFn },
        match: string, /* corresponds to "$&" */
        pn: string[], /* correspond to $1, $2... */
        offset: number,
        whole: string
    ): { [key: string]: string }
    {
        const results = {};
        for (let i = 0; i < pn.length; i++) {
            const key = `$${i+1}`;
            const key2 = i < 10 ? `$0${i+1}` : key;
            const mod = mods[key] || mods[key2];
            if (mod) {
                results[key2] = results[key] = mod(pn[i], match, pn, offset, whole);
            } else {
                results[key2] = results[key] = pn[i];
            }
        }
        const matchedSubstringKey = "$&";
        const preMatchedKey = "$`";
        const postMatchedKey = "$'";
        if (mods[matchedSubstringKey]) {
            results[matchedSubstringKey]
                = mods[matchedSubstringKey](match, match, pn, offset, whole);
        }
        if (mods[preMatchedKey]) {
            const prematch = whole.substr(0, offset);
            results[preMatchedKey]
                = mods[preMatchedKey](prematch, match, pn, offset, whole);
        }
        if (mods[postMatchedKey]) {
            const postmatch = whole.substr(offset + match.length);
            results[postMatchedKey]
                = mods[postMatchedKey](postmatch, match, pn, offset, whole);
        }
        results['$$'] = '$';
        return results;
    }
}