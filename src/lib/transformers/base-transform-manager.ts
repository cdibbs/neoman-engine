import { inject, injectable } from 'inversify';
import * as _ from 'underscore';
import XRegExp = require('xregexp');
import TYPES from '../di/types';
import { IFilePatterns, IHandlerService, ITemplate, IUserMessager } from '../i';
import { RuleMatchResult } from '../models';
import { IPluginManager } from '../plugin-manager/i-plugin-manager';
import { IPathTransform, ITransform } from '../user-extensibility/template';
import { curry } from '../util/curry';
let NestedError = require('nested-error-stacks');

@injectable()
export class BaseTransformManager {
    protected splitter: RegExp = new RegExp(/^\/(.*(?!\\))\/(.*)\/([gimuy]*)$/);
    protected inputs: { [key: string]: any };
    protected tconfigBasePath: string;

    constructor(
        @inject(TYPES.FilePatterns) protected filePatterns: IFilePatterns,
        @inject(TYPES.UserMessager) protected msg: IUserMessager,
        @inject(TYPES.HandlerService) protected hnd: IHandlerService,
        @inject(TYPES.PluginManager) protected plugMgr: IPluginManager
    ) {
        
    }

    configure(tmpl: ITemplate, inputs: { [key: string]: any }) {
        this.inputs = inputs;
        this.plugMgr.preparePlugins(tmpl.configurations);
        this.tconfigBasePath = tmpl.__tmplConfigPath;
    }

    async applyReplace(original: string, tdef: ITransform | IPathTransform, path: string):  Promise<string> {
        // Minimally, we want fast, internal regex replacement. It should be overridable within the configurations section of a template.json.
        let engine = this.chooseReplaceEngine(tdef);

        // Be wary when trying to reduce the redundant rdef.with checks; it's been tried! Type soup.
        switch(engine) {
            case "regex": return this.applyReplaceRegex(original, tdef, path);
            case "simple": return this.applyReplaceSimple(original, tdef, path);
            case "plugin": return this.applyReplacePlugin(original, tdef, path);
            default:
                throw new Error(`Unimplemented transform engine ${engine}.`);
        }
    }

    async applyReplaceRegex(original: string, tdef: ITransform | IPathTransform, path: string): Promise<string>
    {
        const pattern = XRegExp(<string>tdef.subject, tdef.regexFlags || "");
        if (typeof tdef.with === "string") {
            return original.replace(pattern, this.preprocess(tdef.with));
        } else {
            const replacer = await this.buildReplacer(tdef);
            return original.replace(pattern, replacer);
        }
    }

    async applyReplaceSimple(original: string, tdef: ITransform | IPathTransform, path: string): Promise<string>
    {
        if (typeof tdef.with === "string") {
            return original
                .split(<string>tdef.subject)
                .join(this.preprocess(tdef.with));
        } else {
            const replacer = await this.buildReplacer(tdef);
            return original
                .split(<string>tdef.subject)
                .join(replacer(<string>tdef.subject));
        }
    }

    async applyReplacePlugin(original: string, tdef: ITransform | IPathTransform, path: string): Promise<string>
    {
        try {
            const plugin = this.plugMgr.getConfig(tdef.using);
            const options = _.extend({}, plugin.pluginOptions, tdef.params);
            if (typeof tdef.with === "string") {
                return plugin
                    .pluginInstance
                    .transform(path, original, tdef.subject, this.preprocess(tdef.with), options);
            } else {
                const replacer = await this.buildReplacer(tdef);
                return plugin
                    .pluginInstance
                    .transform(path, original, tdef.subject, replacer, options);
            }
        } catch (err) {
            this.msg.i18n({using: tdef.using}).error('Error running plugin from "{using}" configuration:', 3);
            this.msg.error(err.message, 3);
            this.msg.error(err.stack, 4);
            return original;
        }
    }

    chooseReplaceEngine(tdef: ITransform | IPathTransform) {
        if (! tdef)
            throw new Error(this.msg.i18n().mf("Malformed transform definition."));
        
        if (! tdef.using || tdef.using === "regex") {
            if (this.plugMgr.isPluginDefined("regex")) // Then, the user wants to override the default.
                return "plugin";
            
            return "regex";
        } else if (tdef.using === "simple") {
            if (this.plugMgr.isPluginDefined("simple"))
                return "plugin";

            return "simple";
        }

        return "plugin";
    }

    async buildReplacer(tdef: ITransform): Promise<(substr: string) => string> {
        //TODO FIXME not truly implemented
        if (typeof tdef.with === 'object' && tdef.with.handler)
        {
            const hndName = tdef.with.handler;
            const handler = await this.hnd.resolveAndLoad(this.tconfigBasePath, hndName);
            return curry.threeOf4(this.replacerWrapper, this, tdef, hndName, handler);
        }

        throw new Error(`Handler definition missing for transform, or 'with' format invalid.`);
    }

    /**
     * Wraps the calls to user-defined handlers.
     * @param tdef the original transform definition (curried)
     * @param hndName the name of the user-defined handler (curried)
     * @param handler the user-defined handler (curried)
     * @param original value matching transform definition's subject
     * @throws i18n NestedError wrapping any errors in the user handler
     */
    replacerWrapper(tdef: ITransform, hndName: string, handler: Function, original: string): any {
        try {
            let replacement = tdef.with["value"]; // if any...
            return handler(original, replacement, tdef);
        } catch (ex) {
            let errorMsg = this.msg.mf("Error while running user handler '{hndName}'", {hndName});
            throw new NestedError(errorMsg, ex);
        }
    }

    private varMatcher = /{{[^}]*}}/g;
    preprocess(withDef: string): string {
        let result = withDef.replace(this.varMatcher, (match) => {
            return this.inputs[match.substr(2, match.length-4)] /* found it? */
                || (match === "{{{{}}" ? "{{" /* is an escape */ : match /* nope, return same */)
        });
        return result;
    }

    regexToTransform<T extends ITransform | IPathTransform>(def: string): T {
        let components: string[] = def.match(this.splitter);
        if (!components || components.length < 4) {
            throw new Error(this.msg.i18n().mf("Must be a valid javascript replace regular expression: /pattern/replace/[opts]"));
        }

        let searchComponent: string = components[1];
        let replaceComponent: string = components[2];
        let flagsComponent: string = components[3];
        return <T>{
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
    replaceDoesApply(path: string, files: string[], ignore: string[], configKey: string): RuleMatchResult {
        if (typeof files === "undefined" && typeof ignore === "undefined" && typeof configKey === "undefined")
        {
            let reason = "All files and paths match implicitly because no filters defined ('files', 'ignore', etc).";
            return new RuleMatchResult(true, reason);
        }

        let ignoresMatch = (ignore && (ignore instanceof Array) && ignore.length) ? this.filePatterns.match(path, ignore) : [];
        if (ignoresMatch.length) { // explicit exclusion overrides explicit inclusion
            let reason = "Explicitly excluded by user-defined 'ignore' rules.";
            return new RuleMatchResult(false, reason, null, ignoresMatch);
        }

        if (configKey) {
            let configResult = this.configDoesApply(path, configKey);
            if (configResult.matches) {
                let reason = "Included because of 'using' directive: {rules[0]}.";
                return new RuleMatchResult(true, reason, configResult, [configKey]);
            } else if (! files) { // not defined = nothing overriding config non-match
                let reason = "Excluded because 'using' directive '{rules[0]}' does not match, and no explicit, overriding inclusion rule exists.";
                return new RuleMatchResult(false, reason, configResult, [configKey]);
            }
        }

        // if files weren't defined, implicit inclusion. Otherwise, inclusion only if match.
        let filesMatch = (files && (files instanceof Array) && files.length) ? this.filePatterns.match(path, files) : [];
        if (!files || !files.length) {
            let reason = "Included implicitly because no 'using' or 'ignore' rules match.";
            return new RuleMatchResult(true, reason);
        } else if (filesMatch.length) {
            let reason = "Included explicitly by matching 'files' inclusion rules, while no overriding 'ignore' rules match.";
            return new RuleMatchResult(true, reason, null, filesMatch);
        }

        let reason = `Excluded implicitly because 'files' inclusion rules exist, yet none match.` ;
        return new RuleMatchResult(false, reason, null, [path, files.join(',')]);
    }

    /**
     * Determines whether a config definition applies to a given path.
     * Co-recursive with replaceDoesApply.
     * @param path The path against which to check the config definition.
     * @param configKey The key of the config containing include/ignore globs to lookup.
     */
    configDoesApply(path: string, configKey: string): RuleMatchResult {
        if (this.plugMgr.isPluginDefined(configKey)) {
            let c = this.plugMgr.getConfig(configKey);
            let result = this.replaceDoesApply(path, c.files, c.ignore, undefined);
            return result;
        } else {
            throw new Error(`Configuration key "${configKey}" does not exist.`);
        }
    }
}