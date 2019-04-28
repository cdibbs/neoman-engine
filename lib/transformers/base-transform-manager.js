"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var XRegExp = require("xregexp");
var types_1 = require("../di/types");
var models_1 = require("../models");
var NestedError = require('nested-error-stacks');
var BaseTransformManager = /** @class */ (function () {
    function BaseTransformManager(filePatterns, msg) {
        this.filePatterns = filePatterns;
        this.msg = msg;
        this.splitter = new RegExp(/^\/(.*(?!\\))\/(.*)\/([gimuy]*)$/);
        this.varMatcher = /{{[^}]*}}/g;
    }
    BaseTransformManager.prototype.configure = function (tmpl, inputs) {
        this.inputs = inputs;
        this.tconfigBasePath = tmpl.__tmplConfigPath;
    };
    BaseTransformManager.prototype.applyReplace = function (original, tdef, path) {
        return __awaiter(this, void 0, void 0, function () {
            var engine;
            return __generator(this, function (_a) {
                engine = this.chooseReplaceEngine(tdef);
                // Be wary when trying to reduce the redundant rdef.with checks; it's been tried! Type soup.
                switch (engine) {
                    case "regex": return [2 /*return*/, this.applyReplaceRegex(original, tdef, path)];
                    case "simple": return [2 /*return*/, this.applyReplaceSimple(original, tdef, path)];
                    default:
                        throw new Error("Unimplemented transform engine " + engine + ".");
                }
                return [2 /*return*/];
            });
        });
    };
    BaseTransformManager.prototype.applyReplaceRegex = function (original, tdef, path) {
        return __awaiter(this, void 0, void 0, function () {
            var pattern;
            return __generator(this, function (_a) {
                pattern = XRegExp(tdef.subject, tdef.regexFlags || "");
                if (typeof tdef.with === "string") {
                    return [2 /*return*/, original.replace(pattern, this.preprocess(tdef.with))];
                }
                else {
                    throw new Error("Custom replacer overrides not currently supported.");
                }
                return [2 /*return*/];
            });
        });
    };
    BaseTransformManager.prototype.applyReplaceSimple = function (original, tdef, path) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (typeof tdef.with === "string") {
                    return [2 /*return*/, original
                            .split(tdef.subject)
                            .join(this.preprocess(tdef.with))];
                }
                else {
                    throw new Error("Custom replacer overrides not currently supported.");
                }
                return [2 /*return*/];
            });
        });
    };
    BaseTransformManager.prototype.chooseReplaceEngine = function (tdef) {
        if (!tdef)
            throw new Error(this.msg.i18n().mf("Malformed transform definition."));
        if (!tdef.using || tdef.using === "regex") {
            /*if (this.plugMgr.isPluginDefined("regex")) // Then, the user wants to override the default.
                return "plugin";*/
            return "regex";
        }
        else if (tdef.using === "simple") {
            /*if (this.plugMgr.isPluginDefined("simple"))
                return "plugin";*/
            return "simple";
        }
        return "plugin";
    };
    /**
     * Wraps the calls to user-defined handlers.
     * @param tdef the original transform definition (curried)
     * @param hndName the name of the user-defined handler (curried)
     * @param handler the user-defined handler (curried)
     * @param original value matching transform definition's subject
     * @throws i18n NestedError wrapping any errors in the user handler
     */
    BaseTransformManager.prototype.replacerWrapper = function (tdef, hndName, handler, original) {
        try {
            var replacement = tdef.with["value"]; // if any...
            return handler(original, replacement, tdef);
        }
        catch (ex) {
            var errorMsg = this.msg.mf("Error while running user handler '{hndName}'", { hndName: hndName });
            throw new NestedError(errorMsg, ex);
        }
    };
    BaseTransformManager.prototype.preprocess = function (withDef) {
        var _this = this;
        var result = withDef.replace(this.varMatcher, function (match) {
            return _this.inputs[match.substr(2, match.length - 4)] /* found it? */
                || (match === "{{{{}}" ? "{{" /* is an escape */ : match /* nope, return same */);
        });
        return result;
    };
    BaseTransformManager.prototype.regexToTransform = function (def) {
        var components = def.match(this.splitter);
        if (!components || components.length < 4) {
            throw new Error(this.msg.i18n().mf("Must be a valid javascript replace regular expression: /pattern/replace/[opts]"));
        }
        var searchComponent = components[1];
        var replaceComponent = components[2];
        var flagsComponent = components[3];
        return {
            "subject": searchComponent,
            "with": replaceComponent,
            "regexFlags": flagsComponent
        };
    };
    /**
     * Determines whether a config definition, and a set of include/ignore globs apply to a given path.
     * Co-recursive with configDoesApply.
     * @param path The path against which to compare globs.
     * @param files A list of include globs. Files in this list will be included unless explicitly ignored.
     * @param ignore A list of ignore globs. Overrides matches from the files parameter.
     * @param configKey A configuration definition to match (itself containing include/ignore globs).
     */
    BaseTransformManager.prototype.replaceDoesApply = function (path, files, ignore, configKey) {
        if (typeof files === "undefined" && typeof ignore === "undefined" && typeof configKey === "undefined") {
            var reason_1 = "All files and paths match implicitly because no filters defined ('files', 'ignore', etc).";
            return new models_1.RuleMatchResult(true, reason_1);
        }
        var ignoresMatch = (ignore && (ignore instanceof Array) && ignore.length) ? this.filePatterns.match(path, ignore) : [];
        if (ignoresMatch.length) { // explicit exclusion overrides explicit inclusion
            var reason_2 = "Explicitly excluded by user-defined 'ignore' rules.";
            return new models_1.RuleMatchResult(false, reason_2, null, ignoresMatch);
        }
        // if files weren't defined, implicit inclusion. Otherwise, inclusion only if match.
        var filesMatch = (files && (files instanceof Array) && files.length) ? this.filePatterns.match(path, files) : [];
        if (!files || !files.length) {
            var reason_3 = "Included implicitly because no 'using' or 'ignore' rules match.";
            return new models_1.RuleMatchResult(true, reason_3);
        }
        else if (filesMatch.length) {
            var reason_4 = "Included explicitly by matching 'files' inclusion rules, while no overriding 'ignore' rules match.";
            return new models_1.RuleMatchResult(true, reason_4, null, filesMatch);
        }
        var reason = "Excluded implicitly because 'files' inclusion rules exist, yet none match.";
        return new models_1.RuleMatchResult(false, reason, null, [path, files.join(',')]);
    };
    BaseTransformManager = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(types_1.default.FilePatterns)),
        __param(1, inversify_1.inject(types_1.default.UserMessager)),
        __metadata("design:paramtypes", [Object, Object])
    ], BaseTransformManager);
    return BaseTransformManager;
}());
exports.BaseTransformManager = BaseTransformManager;
//# sourceMappingURL=base-transform-manager.js.map