import { injectable, inject } from 'inversify';
const isMatch = require('picomatch').isMatch;
import * as i from './i';

@injectable()
export class FilePatterns implements i.IFilePatterns {
    get _isMatch() { return isMatch; }

    match(path: string, patterns: string[]): string[] {
        return patterns.reduce((p, cpattern) => {
            if (this._isMatch(path, cpattern, { dot: true, posixSlashes: true } )) {
                p.push(cpattern);
            }
            return p;
        }, []);
    }

    isMatch(path: string, pattern: string): boolean {
        return this._isMatch(path, pattern, { dot: true,  });
    }
}