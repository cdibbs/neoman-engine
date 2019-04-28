import { VERBOSITY } from '../types/verbosity';
var RunOptions = /** @class */ (function () {
    function RunOptions() {
        this.verbosity = VERBOSITY.normal;
        this.showExcluded = false;
        this.force = false;
        this.path = "";
        this.name = "";
        this.defaults = false;
        this.simulate = false;
    }
    return RunOptions;
}());
export { RunOptions };
//# sourceMappingURL=run-options.js.map