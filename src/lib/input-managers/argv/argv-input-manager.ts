import { injectable } from 'inversify';
import { RunOptions } from '../../models';
import { IInputConfig, IComplexInputDef, InputDef, IArgvOptions } from '../../user-extensibility';
import { BaseInputManager } from '../base-input-manager';
var NestedError = require('nested-error-stacks');

@injectable()
export class ArgvInputManager extends BaseInputManager {

    constructor(
        
    ) {
        super();
    }

    async ask(config: IInputConfig, options: RunOptions): Promise<{ [key: string]: any }> {
        let dict = {};
        if (!config || !config.define)
        {
            return dict;
        }

        for(let key in config.define) {
            dict[key] = this.findAnswer(options, config.define[key]);
        }

        return dict;
    }

    findAnswer(options: RunOptions, def: InputDef): any {
        if (! options.extraArgs || options.extraArgs.length === 0) {
            return "";
        }

        if (! def) {
            return this.findAnswerSimple(options, <any>def);
        } else if (typeof def === "string") {
            return this.findAnswerSimple(options, def);
        } else if (def && def["prompt"]) {
            return this.findAnswerComplex(options, <IComplexInputDef<IArgvOptions>> def);
        }
    }

    protected findAnswerSimple(options: RunOptions, def?: string) {
        
    }

    protected findAnswerComplex(options: RunOptions, def: IComplexInputDef<IArgvOptions>) {

    }
}