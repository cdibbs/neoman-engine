"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var verbosity_1 = require("../types/verbosity");
var RunOptions = /** @class */ (function () {
    function RunOptions() {
        this.verbosity = verbosity_1.VERBOSITY.normal;
        this.showExcluded = false;
        this.force = false;
        this.path = "";
        this.name = "";
        this.defaults = false;
        this.simulate = false;
    }
    return RunOptions;
}());
exports.RunOptions = RunOptions;
//# sourceMappingURL=run-options.js.map