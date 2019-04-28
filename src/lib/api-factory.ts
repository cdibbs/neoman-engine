import { containerBuilder } from './di/container-builder';
import { Container } from 'inversify';
import { Ii18nFunction } from './i';
import TYPES from './di/types';
import { ITemplateDiscoverer } from './discoverer';
import { ITreeTransformer } from './transformer';

export class ApiFactory {
    private _container: Container;

    constructor(
        i18ntranslate: Ii18nFunction,
        diBuilder: (container: Container) => Container = null
    ) {
        this._container = containerBuilder(null, i18ntranslate);
        if (diBuilder) {
            this._container = diBuilder(this._container);
        }
    }

    buildDiscoverer(): ITemplateDiscoverer {
        return this._container.get(TYPES.TemplateDiscoverer);
    }

    buildTransformer(): ITreeTransformer {
        return this._container.get(TYPES.FSTreeProcessor);
    }
}