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
var ContentTransformManager = /** @class */ (function (_super) {
    __extends(ContentTransformManager, _super);
    function ContentTransformManager(filePatterns, msg) {
        return _super.call(this, filePatterns, msg) || this;
    }
    ContentTransformManager.prototype.applyTransforms = function (path, content, rdef) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (typeof rdef === "undefined") {
                    return [2 /*return*/, content];
                }
                else if (rdef instanceof Array) {
                    return [2 /*return*/, this.replaceInFile(path, content, rdef)];
                }
                else if (typeof rdef === "string") { // simple regexp
                    return [2 /*return*/, this.replaceInFile(path, content, [this.regexToTransform(rdef)])];
                }
                else if (typeof rdef === "object") { // single replacement? treat as rdef
                    return [2 /*return*/, this.replaceInFile(path, content, [rdef])];
                }
                throw new Error("Replace definition not understood. Type found: " + typeof rdef + ".");
            });
        });
    };
    ContentTransformManager.prototype.replaceInFile = function (path, content, rdefs) {
        return __awaiter(this, void 0, void 0, function () {
            var i, rdef;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < rdefs.length)) return [3 /*break*/, 5];
                        rdef = rdefs[i];
                        if (typeof rdef === "string") {
                            rdef = this.regexToTransform(rdef);
                        }
                        if (!(typeof rdef === "object")) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.replaceOne(path, content, rdef)];
                    case 2:
                        content = _a.sent();
                        return [3 /*break*/, 4];
                    case 3: throw new Error("Unrecognized replacement definition " + i + ", type: " + typeof rdef + ".");
                    case 4:
                        i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/, content];
                }
            });
        });
    };
    ContentTransformManager.prototype.replaceOne = function (path, content, rdef) {
        return __awaiter(this, void 0, void 0, function () {
            var src, msgCtxt, check, nest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        src = this.formatSource(rdef);
                        msgCtxt = this.msg.i18n({ subject: rdef.subject, src: src });
                        check = this.replaceDoesApply(path, rdef.files, rdef.ignore, rdef.using);
                        if (!check.matches) return [3 /*break*/, 2];
                        msgCtxt.debug('Applying transform definition for "{subject}"{src}.', 2);
                        return [4 /*yield*/, this.applyReplace(content, rdef, path)];
                    case 1:
                        content = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        nest = msgCtxt.debug('Skipping transform definition for "{subject}"{src}.', 2);
                        this.displaySkipReason(msgCtxt, check);
                        _a.label = 3;
                    case 3: return [2 /*return*/, content];
                }
            });
        });
    };
    ContentTransformManager.prototype.displaySkipReason = function (msgCtxt, check) {
        msgCtxt = msgCtxt.i18n({ rules: check.rules });
        var reason = msgCtxt.mf(check.reason);
        msgCtxt = msgCtxt.i18n({ reason: reason, rulesSummary: (check.rules || []).join(', ') || "N/A" });
        msgCtxt.debug("Reason: {reason}");
        var nest = msgCtxt.debug("Rule(s): {rules}");
        if (check.nestedRuleMatchResult) {
            this.displaySkipReason(nest, check.nestedRuleMatchResult);
        }
    };
    ContentTransformManager.prototype.formatSource = function (rdef) {
        var srcs = [];
        if (rdef.using) {
            srcs.push("using: " + rdef.using);
        }
        if (rdef.with && rdef.with["handler"]) {
            srcs.push("handler: " + rdef.with['handler']);
        }
        return srcs.length ? ' (' + srcs.join(', ') + ')' : '';
    };
    ContentTransformManager = __decorate([
        injectable(),
        __param(0, inject(TYPES.FilePatterns)),
        __param(1, inject(TYPES.UserMessager)),
        __metadata("design:paramtypes", [Object, Object])
    ], ContentTransformManager);
    return ContentTransformManager;
}(BaseTransformManager));
export { ContentTransformManager };
//# sourceMappingURL=content-transform-manager.js.map