import { InputTransform } from "./input-transform";
import { ITemplateComments } from "../i-template-comments";

export interface IDerivedInputDef extends ITemplateComments {
    /**
     * A reference to another key in the input definitions dictionary.
     * The value of this definition will be obtained by applying a
     * transform to the referenced value.
     */
    derivedFrom: string;

    /**
     * A transformation to apply to the referenced value. Can be
     * a regular expression string, or an expanded match-replace-modify
     * definition.
     */
    transform: InputTransform;
}