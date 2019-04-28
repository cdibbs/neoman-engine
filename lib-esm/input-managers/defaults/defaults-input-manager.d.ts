import { RunOptions } from '../../models';
import { IInputConfig } from '../../user-extensibility';
import { BaseInputManager } from '../base-input-manager';
import { IDefaultsAnswerer } from './i-defaults-answerer';
export declare class DefaultsInputManager extends BaseInputManager {
    protected answerer: IDefaultsAnswerer;
    autoInc: number;
    constructor(answerer: IDefaultsAnswerer);
    ask(config: IInputConfig, options: RunOptions): Promise<{
        [key: string]: any;
    }>;
}
