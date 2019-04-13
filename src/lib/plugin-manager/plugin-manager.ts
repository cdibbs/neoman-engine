import { inject, injectable } from "inversify";
import TYPES from "../di/types";
import { IPackage, IUserMessager } from "../i";
import { TemplateConfiguration } from "../transformers/models/configuration";
import { ICapabilities, ICapabilitiesHelper } from "../user-extensibility";
import { IPluginManager } from "./i-plugin-manager";
import { IConfigurations } from "../user-extensibility/template";
import { CapabilitiesHelper } from "../extensibility/capabilities-helper";
let NestedError = require('nested-error-stacks');
let requireg = require('requireg');

@injectable()
export class PluginManager implements IPluginManager {
    protected plugins: { [key: string]: TemplateConfiguration };

    constructor(
        @inject(TYPES.UserMessager) protected msg: IUserMessager,
        @inject(TYPES.PackageJson) protected pckgJson: IPackage
    ) {
        this.plugins = {};
    }
    
    getConfig(key: string): TemplateConfiguration {
        return this.plugins[key];
    }

    isPluginDefined(key: string): boolean {
        return this.plugins.hasOwnProperty(key);
    }

    listPlugins(): TemplateConfiguration[] {
        return Object
            .keys(this.plugins)
            .map(k => this.plugins[k]);
    }
   
    //FIXME Need to cover plugin loading with better tests
    async preparePlugins(tconfigs: IConfigurations): Promise<void> {
        this.plugins = {};
        for (let key in tconfigs) {
            let tconfig = tconfigs[key];
            let config = new TemplateConfiguration();
            config.key = key;
            config.files = tconfig.files;
            config.ignore = tconfig.ignore;
            config.plugin = tconfig.plugin;
            config.npmPluginName = config.plugin ? `neoman-plugin-${config.plugin}` : null;
            config.pluginOptions = tconfig.pluginOptions;
            config.rawConfig = tconfig;
            this.loadPlugin(config);
            this.plugins[key] = config;
        }

        const cap = new CapabilitiesHelper(this.pckgJson.version, Object.keys(this.plugins));
        for (let key in this.plugins) {
            await this.configurePlugin(this.plugins[key], cap);
        }
    }

    protected loadPlugin(config: TemplateConfiguration): void {
        if (! config.plugin) {
            return; // plugin-less configurations can validly be used to organize settings.
        }

        let PluginClass: { new(): any };
        try {
            PluginClass = this.requireg(config.npmPluginName);
        } catch(ex) {
            throw new NestedError(
                this.msg.mf(
                    "Error loading plugin '{pluginName}'.",
                    {pluginName: config.npmPluginName}),
                ex);
        }

        try {
            config.pluginInstance = new PluginClass();
        } catch(ex) {
            throw new NestedError(
                this.msg.mf(
                    "Error instantiating plugin '{pluginName}'.",
                    {pluginName: config.npmPluginName}),
                ex);
        }
    }

    protected async configurePlugin(plugin: TemplateConfiguration, cap: ICapabilitiesHelper): Promise<void> {
        try {
            await plugin.pluginInstance.configure(cap, plugin.pluginOptions);
        } catch(ex) {
            throw new NestedError(
                this.msg.mf(
                    "Error calling .configure(capabilities, pluginOptions) on '{pluginName}' instance.",
                    {pluginName: plugin.npmPluginName}),
                ex);
        }
    }

    requireg = requireg;
}