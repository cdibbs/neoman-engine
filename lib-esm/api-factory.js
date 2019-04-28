import { containerBuilder } from './di/container-builder';
import TYPES from './di/types';
var ApiFactory = /** @class */ (function () {
    function ApiFactory(i18ntranslate, diBuilder) {
        if (diBuilder === void 0) { diBuilder = null; }
        this._container = containerBuilder(null, i18ntranslate);
        if (diBuilder) {
            this._container = diBuilder(this._container);
        }
    }
    ApiFactory.prototype.buildDiscoverer = function () {
        return this._container.get(TYPES.TemplateDiscoverer);
    };
    ApiFactory.prototype.buildTransformer = function () {
        return this._container.get(TYPES.FSTreeProcessor);
    };
    return ApiFactory;
}());
export { ApiFactory };
//# sourceMappingURL=api-factory.js.map