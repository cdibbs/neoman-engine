import { inject, injectable } from 'inversify';
import * as _ from 'underscore';
import * as XRegExp from 'xregexp';
import TYPES from '../di/types';
import { IFilePatterns, ITemplate, IUserMessager } from '../i';
import { RuleMatchResult } from '../models';
import { IPathTransform, ITransform } from '../user-extensibility/template';
let NestedError = require('nested-error-stacks');

@injectable()
export class BaseTransformManager {
    protected splitter: RegExp = new RegExp(/^\/(.*(?!\\))\/(.*)\/([gimuy]*)$/);
    protected inputs: { [key: string]: any };
    protected tconfigBasePath: string;

    constructor(
        @inject(TYPES.FilePatterns) protected filePatterns: IFilePatterns,
        @inject(TYPES.UserMessager) protected msg: IUserMessager
    ) {
        
    }

    configure(tmpl: ITemplate, inputs: { [key: string]: any }) {
        this.inputs = inputs;
        this.tconfigBasePath = tmpl.__tmplConfigPath;
    }

    async applyReplace(original: string, tdef: ITransform | IPathTransform, path: string):  Promise<string> {
        // Minimally, we want fast, internal regex replacement. It should be overridable within the configurations section of a template.json.
        let engine = this.chooseReplaceEngine(tdef);

        // Be wary when trying to reduce the redundant rdef.with checks; it's been tried! Type soup.
        switch(engine) {
            case "regex": return this.applyReplaceRegex(original, tdef, path);
            case "simple": return this.applyReplaceSimple(original, tdef, path);
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
            throw new Error(`Custom replacer overrides not currently supported.`);
        }
    }

    async applyReplaceSimple(original: string, tdef: ITransform | IPathTransform, path: string): Promise<string>
    {
        if (typeof tdef.with === "string") {
            return original
                .split(<string>tdef.subject)
                .join(this.preprocess(tdef.with));
        } else {
            throw new Error(`Custom replacer overrides not currently supported.`);
        }
    }

    chooseReplaceEngine(tdef: ITransform | IPathTransform) {
        if (! tdef)
            throw new Error(this.msg.i18n().mf("Malformed transform definition."));
        
        if (! tdef.using || tdef.using === "regex") {
            /*if (this.plugMgr.isPluginDefined("regex")) // Then, the user wants to override the default.
                return "plugin";*/
            
            return "regex";
        } else if (tdef.using === "simple") {
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
}