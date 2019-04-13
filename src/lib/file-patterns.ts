import { injectable, inject } from 'inversify';

import * as minimatch from 'minimatch';
import * as i from './i';

@injectable()
export class FilePatterns implements i.IFilePatterns {
    get minimatch() { return minimatch; }

    match(path: string, patterns: string[]): string[] {
        return patterns.reduce((p, cpattern) => {
            if (this.minimatch(path, cpattern, { dot: true } )) {
                p.push(cpattern);
            }
            return p;
        }, []);
    }
}