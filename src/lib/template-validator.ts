import { injectable } from 'inversify';
import { PLUGIN_PREFIX } from './constants';
import { ITemplateValidator, ITemplate } from './i';
import { IConfigurations, IConfiguration } from './user-extensibility/template';

const requireg = require('requireg');

@injectable()
export class TemplateValidator implements ITemplateValidator {
    requireg = requireg;

    dependenciesInstalled(tmpl: ITemplate): { [key: string]: boolean } {
        const configs: IConfigurations = tmpl.configurations;
        const installed: { [key: string]: boolean } = {};
        for(var key in configs) {
            const config: IConfiguration = configs[key];
            const fullname: string = PLUGIN_PREFIX + config.plugin;
            try {
                this.requireg.resolve(PLUGIN_PREFIX + config.plugin);
                installed[fullname] = true;
            } catch (err) {
                installed[fullname] = false;
            }
        }

        return installed;
    }
}