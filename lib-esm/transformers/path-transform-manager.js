var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { inject, injectable } from 'inversify';
import TYPES from '../di/types';
import { BaseTransformManager } from './base-transform-manager';
var PathTransformManager = /** @class */ (function (_super) {
    __extends(PathTransformManager, _super);
    function PathTransformManager(filePatterns, msg) {
        return _super.call(this, filePatterns, msg) || this;
    }
    PathTransformManager.prototype.applyTransforms = function (path, tdef) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (typeof tdef === "undefined") {
                    return [2 /*return*/, path];
                }
                else if (tdef instanceof Array) {
                    return [2 /*return*/, this.transformAll(path, tdef)];
                }
                else if (typeof tdef === "string") { // simple regexp?
                    return [2 /*return*/, this.transformAll(path, [this.regexToTransform(tdef)])];
                }
                else if (typeof tdef === "object") { // single replacement? treat as rdef
                    return [2 /*return*/, this.transformAll(path, [tdef])];
                }
                throw new Error("Replace definition not understood. Type found: " + typeof tdef + ".");
            });
        });
    };
    PathTransformManager.prototype.transformAll = function (path, transforms) {
        return __awaiter(this, void 0, void 0, function () {
            var processing, i, t;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        processing = path;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < transforms.length)) return [3 /*break*/, 5];
                        t = transforms[i];
                        if (typeof t === "string") {
                            t = this.regexToTransform(t);
                        }
                        if (!(typeof t === "object")) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.transformOne(processing, t, i)];
                    case 2:
                        processing = _a.sent();
                        return [3 /*break*/, 4];
                    case 3: throw new Error("I do not understand format of path transform #" + (i + 1) + ", type " + typeof t + ".");
                    case 4:
                        i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/, processing];
                }
            });
        });
    };
    PathTransformManager.prototype.transformOne = function (processing, t, i) {
        return __awaiter(this, void 0, void 0, function () {
            var check;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        check = this.replaceDoesApply(processing, t.files, t.ignore, t.using);
                        if (!check.matches) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.applyIfMatch(t, processing, i)];
                    case 1:
                        processing = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        this.msg.i18n({ i: i, subject: t.subject }).debug('Skipping path transform def #{i}, "{subject}" (no match: config or globs).', 2);
                        _a.label = 3;
                    case 3: return [2 /*return*/, processing];
                }
            });
        });
    };
    PathTransformManager.prototype.applyIfMatch = function (t, path, i) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!path.match(t.subject)) return [3 /*break*/, 2];
                        this.msg.i18n({ subject: t.subject }).debug('Applying path transform for "{subject}".', 2);
                        return [4 /*yield*/, this.applyReplace(path, t, path)];
                    case 1:
                        path = _a.sent();
                        this.msg.i18n({ path: path }).debug('Int. result: {path}', 3);
                        return [3 /*break*/, 3];
                    case 2:
                        this.msg.i18n({ i: i, subject: t.subject }).debug('Skipping path transform def #{i} (no match: "{subject}").', 2);
                        _a.label = 3;
                    case 3: return [2 /*return*/, path];
                }
            });
        });
    };
    PathTransformManager = __decorate([
        injectable(),
        __param(0, inject(TYPES.FilePatterns)),
        __param(1, inject(TYPES.UserMessager)),
        __metadata("design:paramtypes", [Object, Object])
    ], PathTransformManager);
    return PathTransformManager;
}(BaseTransformManager));
export { PathTransformManager };
//# sourceMappingURL=path-transform-manager.js.map