import { RunOptions, RunnerResult } from '../../models';
import { ITemplate } from '../../i';

export interface IFSTreeProcessor {
    process(srcPath: string, destPath: string, options: RunOptions, inputs: { [key: string]: any }, tmpl: ITemplate): Promise<RunnerResult>
}