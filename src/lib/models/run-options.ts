import { Verbosity, VERBOSITY } from '../types/verbosity';

export class RunOptions {
    verbosity: Verbosity = VERBOSITY.normal;
    showExcluded: boolean = false;
    force: boolean = false;
    path: string = "";
    name: string = "";
    defaults: boolean = false;
    simulate: boolean = false;
    rawArgs: string[];

    /**
     * These are arguments following a " -- " separator.
     * E.g., "neoman new mytmplid -- some extra parameters"
     */
    extraArgs: string[];
}