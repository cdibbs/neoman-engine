import { RunOptions } from '../../models';
import { IInputConfig, IComplexInputDef, InputDef, IArgvOptions } from '../../user-extensibility';
import { BaseInputManager } from '../base-input-manager';
export declare class ArgvInputManager extends BaseInputManager {
    constructor();
    ask(config: IInputConfig, options: RunOptions): Promise<{
        [key: string]: any;
    }>;
    findAnswer(options: RunOptions, def: InputDef): any;
    protected findAnswerSimple(options: RunOptions, def?: string): void;
    protected findAnswerComplex(options: RunOptions, def: IComplexInputDef<IArgvOptions>): void;
}
