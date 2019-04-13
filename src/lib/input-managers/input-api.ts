import { IDerivedInputDef, ITransform, InputTransform, IInputTransform } from "../user-extensibility";
import { injectable, inject } from "inversify";
import { IRegexer } from "../util/i-regexer";
import TYPES from "../di/types";
import { IUserMessager } from "../i";
import { IHandlerReference } from "../user-extensibility/template/common";
import { IBuiltinTransforms } from "./transforms/i-builtin-transforms";

@injectable()
export class InputApi {
    protected splitter: RegExp = new RegExp(/^\/(.*(?!\\))\/(.*)\/([gimuy]*)$/);

    constructor(
        @inject(TYPES.UserMessager) protected msg: IUserMessager,
        @inject(TYPES.Regexer) protected regexer: IRegexer,
        @inject(TYPES.BuiltinTransforms) protected trans: IBuiltinTransforms
    ) {

    }

    derive(def: IDerivedInputDef, values: { [key: string]: string }): string {
        const sourceVal = values[def.derivedFrom];
        const trans = this.buildTransformDef(def);
        const handlers = this.buildHandlersDict(trans.modify);
        return this.regexer.transform(sourceVal, trans.match, trans.replace, handlers);
    }

    protected buildTransformDef(def: IDerivedInputDef): IInputTransform {
        if (typeof def.transform === "string") {
            const components: string[] = def.transform.match(this.splitter);
            if (!components || components.length < 5) {
                throw new Error(this.msg.mf("Must be a valid javascript replace regular expression: /pattern/replace/[opts]"));
            }

            return {
                match: "/" + components[1] + "/" + components[3],
                replace: components[2],
                modify: {}
            };
        } else if (typeof def.transform === "object") {
            return def.transform;
        } else {
            throw new Error(this.msg.mf(`Unrecognized input transform definition. Type: ${typeof def.transform}.`))
        }
    }

    protected buildHandlersDict(
        modifyDefs: { [key: string]: string | IHandlerReference }
    ): { [key: string]: (i: string) => string }
    {
        const keys = Object.keys(modifyDefs);
        const dict = {};
        for (let key in keys) {
            var t = this.trans.get(key);
            if (!t) {
                throw new Error(this.msg.mf(`Unrecognized built-in transform: ${key}.`));
            }
            dict[key] = t.transform;
        }

        return dict;
    }
}