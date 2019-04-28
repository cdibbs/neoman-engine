import { IFilePatterns, ITemplate, IUserMessager } from '../i';
import { RuleMatchResult } from '../models';
import { IPathTransform, ITransform } from '../user-extensibility/template';
export declare class BaseTransformManager {
    protected filePatterns: IFilePatterns;
    protected msg: IUserMessager;
    protected splitter: RegExp;
    protected inputs: {
        [key: string]: any;
    };
    protected tconfigBasePath: string;
    constructor(filePatterns: IFilePatterns, msg: IUserMessager);
    configure(tmpl: ITemplate, inputs: {
        [key: string]: any;
    }): void;
    applyReplace(original: string, tdef: ITransform | IPathTransform, path: string): Promise<string>;
    applyReplaceRegex(original: string, tdef: ITransform | IPathTransform, path: string): Promise<string>;
    applyReplaceSimple(original: string, tdef: ITransform | IPathTransform, path: string): Promise<string>;
    chooseReplaceEngine(tdef: ITransform | IPathTransform): "plugin" | "regex" | "simple";
    /**
     * Wraps the calls to user-defined handlers.
     * @param tdef the original transform definition (curried)
     * @param hndName the name of the user-defined handler (curried)
     * @param handler the user-defined handler (curried)
     * @param original value matching transform definition's subject
     * @throws i18n NestedError wrapping any errors in the user handler
     */
    replacerWrapper(tdef: ITransform, hndName: string, handler: Function, original: string): any;
    private varMatcher;
    preprocess(withDef: string): string;
    regexToTransform<T extends ITransform | IPathTransform>(def: string): T;
    /**
     * Determines whether a config definition, and a set of include/ignore globs apply to a given path.
     * Co-recursive with configDoesApply.
     * @param path The path against which to compare globs.
     * @param files A list of include globs. Files in this list will be included unless explicitly ignored.
     * @param ignore A list of ignore globs. Overrides matches from the files parameter.
     * @param configKey A configuration definition to match (itself containing include/ignore globs).
     */
    replaceDoesApply(path: string, files: string[], ignore: string[], configKey: string): RuleMatchResult;
}
