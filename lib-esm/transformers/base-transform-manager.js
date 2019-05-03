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
import { inject, injectable } from 'inversify';
import * as XRegExp from 'xregexp';
import TYPES from '../di/types';
import { RuleMatchResult } from '../models';
let NestedError = require('nested-error-stacks');
let BaseTransformManager = class BaseTransformManager {
    constructor(filePatterns, msg) {
        this.filePatterns = filePatterns;
        this.msg = msg;
        this.splitter = new RegExp(/^\/(.*(?!\\))\/(.*)\/([gimuy]*)$/);
        this.varMatcher = /{{[^}]*}}/g;
    }
    configure(tmpl, inputs) {
        this.inputs = inputs;
        this.tconfigBasePath = tmpl.__tmplConfigPath;
    }
    async applyReplace(original, tdef, path) {
        // Minimally, we want fast, internal regex replacement. It should be overridable within the configurations section of a template.json.
        let engine = this.chooseReplaceEngine(tdef);
        // Be wary when trying to reduce the redundant rdef.with checks; it's been tried! Type soup.
        switch (engine) {
            case "regex": return this.applyReplaceRegex(original, tdef, path);
            case "simple": return this.applyReplaceSimple(original, tdef, path);
            default:
                throw new Error(`Unimplemented transform engine ${engine}.`);
        }
    }
    async applyReplaceRegex(original, tdef, path) {
        const pattern = XRegExp(tdef.subject, tdef.regexFlags || "");
        if (typeof tdef.with === "string") {
            return original.replace(pattern, this.preprocess(tdef.with));
        }
        else {
            throw new Error(`Custom replacer overrides not currently supported.`);
        }
    }
    async applyReplaceSimple(original, tdef, path) {
        if (typeof tdef.with === "string") {
            return original
                .split(tdef.subject)
                .join(this.preprocess(tdef.with));
        }
        else {
            throw new Error(`Custom replacer overrides not currently supported.`);
        }
    }
    chooseReplaceEngine(tdef) {
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
    }
    /**
     * Wraps the calls to user-defined handlers.
     * @param tdef the original transform definition (curried)
     * @param hndName the name of the user-defined handler (curried)
     * @param handler the user-defined handler (curried)
     * @param original value matching transform definition's subject
     * @throws i18n NestedError wrapping any errors in the user handler
     */
    replacerWrapper(tdef, hndName, handler, original) {
        try {
            let replacement = tdef.with["value"]; // if any...
            return handler(original, replacement, tdef);
        }
        catch (ex) {
            let errorMsg = this.msg.mf("Error while running user handler '{hndName}'", { hndName });
            throw new NestedError(errorMsg, ex);
        }
    }
    preprocess(withDef) {
        let result = withDef.replace(this.varMatcher, (match) => {
            return this.inputs[match.substr(2, match.length - 4)] /* found it? */
                || (match === "{{{{}}" ? "{{" /* is an escape */ : match /* nope, return same */);
        });
        return result;
    }
    regexToTransform(def) {
        let components = def.match(this.splitter);
        if (!components || components.length < 4) {
            throw new Error(this.msg.i18n().mf("Must be a valid javascript replace regular expression: /pattern/replace/[opts]"));
        }
        let searchComponent = components[1];
        let replaceComponent = components[2];
        let flagsComponent = components[3];
        return {
            "subject": searchComponent,
            "with": replaceComponent,
            "regexFlags": flagsComponent
        };
    }
    /**
     * Determines whether a config definition, and a set of include/ignore globs apply to a given path.
     * Co-recursive with configDoesApply.
     * @param path The path against which to compare globs.
     * @param files A list of include globs. Files in this list will be included unless explicitly ignored.
     * @param ignore A list of ignore globs. Overrides matches from the files parameter.
     * @param configKey A configuration definition to match (itself containing include/ignore globs).
     */
    replaceDoesApply(path, files, ignore, configKey) {
        if (typeof files === "undefined" && typeof ignore === "undefined" && typeof configKey === "undefined") {
            let reason = "All files and paths match implicitly because no filters defined ('files', 'ignore', etc).";
            return new RuleMatchResult(true, reason);
        }
        let ignoresMatch = (ignore && (ignore instanceof Array) && ignore.length) ? this.filePatterns.match(path, ignore) : [];
        if (ignoresMatch.length) { // explicit exclusion overrides explicit inclusion
            let reason = "Explicitly excluded by user-defined 'ignore' rules.";
            return new RuleMatchResult(false, reason, null, ignoresMatch);
        }
        // if files weren't defined, implicit inclusion. Otherwise, inclusion only if match.
        let filesMatch = (files && (files instanceof Array) && files.length) ? this.filePatterns.match(path, files) : [];
        if (!files || !files.length) {
            let reason = "Included implicitly because no 'using' or 'ignore' rules match.";
            return new RuleMatchResult(true, reason);
        }
        else if (filesMatch.length) {
            let reason = "Included explicitly by matching 'files' inclusion rules, while no overriding 'ignore' rules match.";
            return new RuleMatchResult(true, reason, null, filesMatch);
        }
        let reason = `Excluded implicitly because 'files' inclusion rules exist, yet none match.`;
        return new RuleMatchResult(false, reason, null, [path, files.join(',')]);
    }
};
BaseTransformManager = __decorate([
    injectable(),
    __param(0, inject(TYPES.FilePatterns)),
    __param(1, inject(TYPES.UserMessager)),
    __metadata("design:paramtypes", [Object, Object])
], BaseTransformManager);
export { BaseTransformManager };
//# sourceMappingURL=base-transform-manager.js.map