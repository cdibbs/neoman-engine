import { containerBuilder } from './di/container-builder';
import TYPES from './di/types';
export class ApiFactory {
    constructor(i18ntranslate, diBuilder = null) {
        this._container = containerBuilder(null, i18ntranslate);
        if (diBuilder) {
            this._container = diBuilder(this._container);
        }
    }
    buildDiscoverer() {
        return this._container.get(TYPES.TemplateDiscoverer);
    }
    buildTransformer() {
        return this._container.get(TYPES.FSTreeProcessor);
    }
}
//# sourceMappingURL=api-factory.js.map