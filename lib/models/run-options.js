import { VERBOSITY } from '../types/verbosity';
export class RunOptions {
    constructor() {
        this.verbosity = VERBOSITY.normal;
        this.showExcluded = false;
        this.force = false;
        this.path = "";
        this.name = "";
        this.defaults = false;
        this.simulate = false;
    }
}
//# sourceMappingURL=run-options.js.map