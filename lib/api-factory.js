"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var container_builder_1 = require("./di/container-builder");
var types_1 = require("./di/types");
var ApiFactory = /** @class */ (function () {
    function ApiFactory(i18ntranslate, diBuilder) {
        if (diBuilder === void 0) { diBuilder = null; }
        this._container = container_builder_1.containerBuilder(null, i18ntranslate);
        if (diBuilder) {
            this._container = diBuilder(this._container);
        }
    }
    ApiFactory.prototype.buildDiscoverer = function () {
        return this._container.get(types_1.default.TemplateDiscoverer);
    };
    ApiFactory.prototype.buildTransformer = function () {
        return this._container.get(types_1.default.FSTreeProcessor);
    };
    return ApiFactory;
}());
exports.ApiFactory = ApiFactory;
//# sourceMappingURL=api-factory.js.map