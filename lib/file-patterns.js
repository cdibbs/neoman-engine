var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from 'inversify';
const isMatch = require('picomatch').isMatch;
let FilePatterns = class FilePatterns {
    get _isMatch() { return isMatch; }
    match(path, patterns) {
        return patterns.reduce((p, cpattern) => {
            if (this._isMatch(path, cpattern, { dot: true })) {
                p.push(cpattern);
            }
            return p;
        }, []);
    }
    isMatch(path, pattern) {
        return this._isMatch(path, pattern, { dot: true });
    }
};
FilePatterns = __decorate([
    injectable()
], FilePatterns);
export { FilePatterns };
//# sourceMappingURL=file-patterns.js.map