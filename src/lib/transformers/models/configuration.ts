import { ITransformPlugin } from '../../user-extensibility/i-transform-plugin';
import { IConfiguration } from '../../user-extensibility/template';

export class TemplateConfiguration implements IConfiguration {
    key: string;
    pluginInstance: ITransformPlugin;

    files: string[];
    ignore: string[];
    plugin: string;
    npmPluginName: string;
    pluginOptions: any;

    rawConfig: IConfiguration;
}