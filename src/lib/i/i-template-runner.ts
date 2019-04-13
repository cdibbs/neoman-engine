import { RunOptions, RunnerResult } from '../models';
import { ITemplate } from './i-template';

export interface ITemplateRunner {
    run(path: string, options: RunOptions, tmpl: ITemplate): Promise<RunnerResult>
}