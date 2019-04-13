import { ITemplateComments } from "../i-template-comments";
import { IArgvOptions } from "./i-argv-options";
import { IComplexInputDef } from "./i-complex-input-def";
import { IHandlerReference } from "../common";
import { InputTransform } from "./input-transform";
import { InputInterfaceConfig } from "./input-interface-config";
import { InputDef } from "./input-def";

export interface IInputDefs extends ITemplateComments {
    [key: string]: InputDef;
}

export type InputConfigType = "prompt" | "browser" | "argv" | InputInterfaceConfig;

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