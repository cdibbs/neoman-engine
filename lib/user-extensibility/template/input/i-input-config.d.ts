import { ITemplateComments } from "../i-template-comments";
import { InputInterfaceConfig } from "./input-interface-config";
import { InputDef } from "./input-def";
export interface IInputDefs extends ITemplateComments {
    [key: string]: InputDef;
}
export declare type InputConfigType = "prompt" | "browser" | "argv" | InputInterfaceConfig;
export interface IInputConfig extends ITemplateComments {
    use?: InputConfigType;
    /**
     * Specifies a .js file in the .neoman.config/handlers/ directory.
     * Takes the entire IInputConfig as input, and returns a dictionary whose
     * keys will be available to the replace section.
     **/
    handler?: string;
    /** Optional text to show user before prompting. */
    preface?: string;
    /** A dictionary with variable names as keys and question definitions as values. */
    define?: IInputDefs;
}
