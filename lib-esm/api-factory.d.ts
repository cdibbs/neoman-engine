import { Container } from 'inversify';
import { Ii18nFunction } from './i';
import { ITemplateDiscoverer } from './discoverer';
import { ITreeTransformer } from './transformer';
export declare class ApiFactory {
    private _container;
    constructor(i18ntranslate: Ii18nFunction, diBuilder?: (container: Container) => Container);
    buildDiscoverer(): ITemplateDiscoverer;
    buildTransformer(): ITreeTransformer;
}
