import { RunOptions } from '../models';
import { IInputConfig } from '../user-extensibility';

export interface IInputManager {
    configure(tmplRootPath: string): void;
    ask(inputs: IInputConfig, options: RunOptions): Promise<{ [key: string]: any }>;
}