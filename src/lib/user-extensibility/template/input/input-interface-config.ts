import { ITemplateComments } from "../i-template-comments";
import { IHandlerReference, IPluginReference } from "../common";

export interface IBaseInterfaceConfig<TType> extends ITemplateComments {
    type: TType;
}

export interface IPromptInterfaceConfig extends IBaseInterfaceConfig<"prompt"> {

}

export interface IBrowserInterfaceConfig extends IBaseInterfaceConfig<"browser"> {

}

export interface IArgvInterfaceConfig extends IBaseInterfaceConfig<"argv"> {

}

export interface IHandlerInterfaceConfig
    extends IBaseInterfaceConfig<"handler">,
            IHandlerReference
{

}

export interface IPluginInterfaceConfig
    extends IBaseInterfaceConfig<"plugin">,
            IPluginReference
{

}

/**
 * Allows you to specify global configuration for the given input provider
 * or a handler reference to provide your own, custom input.
 */
export type InputInterfaceConfig
    = IPromptInterfaceConfig
    | IArgvInterfaceConfig
    | IBrowserInterfaceConfig
    | IHandlerInterfaceConfig
    | IPluginInterfaceConfig;