import { Verbosity } from '../types/verbosity';
export declare class RunOptions {
    verbosity: Verbosity;
    showExcluded: boolean;
    force: boolean;
    path: string;
    name: string;
    defaults: boolean;
    simulate: boolean;
    rawArgs: string[];
    /**
     * These are arguments following a " -- " separator.
     * E.g., "neoman new mytmplid -- some extra parameters"
     */
    extraArgs: string[];
}
