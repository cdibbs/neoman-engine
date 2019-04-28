var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from 'inversify';
var isMatch = require('picomatch').isMatch;
var FilePatterns = /** @class */ (function () {
    function FilePatterns() {
    }
    Object.defineProperty(FilePatterns.prototype, "_isMatch", {
        get: function () { return isMatch; },
        enumerable: true,
        configurable: true
    });
    FilePatterns.prototype.match = function (path, patterns) {
        var _this = this;
        return patterns.reduce(function (p, cpattern) {
            if (_this._isMatch(path, cpattern, { dot: true })) {
                p.push(cpattern);
            }
            return p;
        }, []);
    };
    FilePatterns.prototype.isMatch = function (path, pattern) {
        return this._isMatch(path, pattern, { dot: true });
    };
    FilePatterns = __decorate([
        injectable()
    ], FilePatterns);
    return FilePatterns;
}());
export { FilePatterns };
//# sourceMappingURL=file-patterns.js.map