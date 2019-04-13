import { inject, injectable } from "inversify";
import * as _ from "lodash";
import TYPES from "../di/types";
import { IUserMessager, ITemplate } from "../i";
import { ITemplatePreprocessor } from "./i-template-preprocessor";
import { IRawTemplate } from "../user-extensibility/template";

// For the moment, this exists only to eliminate comments from the JSON.
// TODO FIXME:
//  - we should look into mapper frameworks. None of them look great, atm (2017-06-24).
//  - we should move all template validation to live under the "preprocess" call.
@injectable()
export class TemplatePreprocessor implements ITemplatePreprocessor {
    constructor(
        @inject(TYPES.UserMessager) protected msg: IUserMessager
    ) {
    }

    preprocess(rawTmpl: IRawTemplate): ITemplate {
        const tmpl = this.stripComments(_.cloneDeep(rawTmpl));
        tmpl.rawTemplate = Object.freeze(rawTmpl);
        return tmpl;
    }

    /**
     * Co-recursive with stripObjectComments and stripArrayComments. Removes
     * "#" key from nested objects, and strings beginning with "#" from arrays.
     * @param obj 
     * @param parent 
     * @param curKey 
     */
    private stripComments(obj: any, parent?: any, curKey?: string | number): ITemplate {        
        if (obj instanceof Array) {
            return this.stripArrayComments(obj, parent, curKey);
        } else if (typeof obj === "object") {
            return this.stripObjectComments(obj, parent, curKey);
        }

        return obj;
    }

    /**
     * Co-recursive with stripComments. Removes key "#" from nested objects.
     * @param obj 
     * @param parent 
     * @param curKey 
     */
    private stripObjectComments(obj: any, parent?: any, curKey?: string | number): any {
        for(var key in obj) {
            if (key === "#") {
                delete obj[key];
            } else if (typeof obj[key] === "object") {
                obj[key] = this.stripComments(obj[key], obj, key);
            }
        }

        return obj;
    }

    /**
     * Co-recursive with stripComments. Removes strings beginning with "#" from arrays.
     * @param obj 
     * @param parent 
     * @param curKey 
     */
    private stripArrayComments(obj: any, parent?: any, curKey?: string | number): any {
        if (!parent) {
            throw new Error(this.msg.i18n().mf("Root-level configuration element cannot be an array."));
        }

        const stripped = [];
        for(var i=0; i<obj.length; i++) {
            if (typeof obj[i] !== "string" || obj[i].substr(0, 1) !== "#")
            {
                stripped.push(this.stripComments(obj[i], obj, i));
            }
        }

        return stripped;
    }
}