import * as i from '../i';
import { RunOptions } from '../models';
import { IInputConfig, InputDef } from '../user-extensibility';
export declare abstract class BaseInputManager implements i.IInputManager {
    protected tmplRootPath: string;
    configure(tmplRootPath: string): void;
    abstract ask(config: IInputConfig, options: RunOptions): Promise<{
        [key: string]: any;
    }>;
    getDerived(inputDef: InputDef, currentResults: {
        [key: string]: any;
    }): string;
}
