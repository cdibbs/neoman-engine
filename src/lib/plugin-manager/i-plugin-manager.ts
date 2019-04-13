import { TemplateConfiguration } from "../transformers/models/configuration";
import { IConfigurations } from "../user-extensibility/template";

export interface IPluginManager {
    getConfig(key: string): TemplateConfiguration;
    preparePlugins(tconfigs: IConfigurations): void;
    isPluginDefined(key: string): boolean;
    listPlugins(): TemplateConfiguration[];
}