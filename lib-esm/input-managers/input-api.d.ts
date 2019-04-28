import { IDerivedInputDef, IInputTransform } from "../user-extensibility";
import { IRegexer } from "../util/i-regexer";
import { IUserMessager } from "../i";
import { IHandlerReference } from "../user-extensibility/template/common";
import { IBuiltinTransforms } from "./transforms/i-builtin-transforms";
export declare class InputApi {
    protected msg: IUserMessager;
    protected regexer: IRegexer;
    protected trans: IBuiltinTransforms;
    protected splitter: RegExp;
    constructor(msg: IUserMessager, regexer: IRegexer, trans: IBuiltinTransforms);
    derive(def: IDerivedInputDef, values: {
        [key: string]: string;
    }): string;
    protected buildTransformDef(def: IDerivedInputDef): IInputTransform;
    protected buildHandlersDict(modifyDefs: {
        [key: string]: string | IHandlerReference;
    }): {
        [key: string]: (i: string) => string;
    };
}
