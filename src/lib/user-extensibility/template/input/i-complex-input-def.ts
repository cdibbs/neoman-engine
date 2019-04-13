import { ITemplateComments } from "../i-template-comments";
import { InputTransform } from "./input-transform";
import { IValidationDef } from "./i-validate-def";

export interface IComplexInputDef<TOptions> extends ITemplateComments {
    /** A suggested prompt string for the input plugin. */
    prompt: string;

    /** Plugin-specific input options. */
    options?: TOptions;

    /** The default value. */
    default?: any;

    /** A regular expression or an IValidationDef that describes how to validate the input. */
    validate?: string | IValidationDef;

    /** Any transformations to apply to the user input. Can be a regular
     * expression string of the form "/start(parts)/end$1/g", or an
     * IInputTransform object.
     */
    transform?: InputTransform;
}