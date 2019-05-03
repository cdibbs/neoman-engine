import { Container } from "inversify";
import 'reflect-metadata';
import { FilePatterns } from '../file-patterns';
import { TemplateDiscoverer } from "../discoverer";
import { TreeTransformer } from "../transformer/tree-transformer";
import { PathTransformManager, ContentTransformManager } from '../transformers';
import { UserMessager } from '../user-messager';
import TYPES from "./types";
import { Regexer } from '../util/regexer';
import { Settings } from '../models';
import { Mapper } from "../mapper";
export const containerBuilder = (container, i18nTranslate = null) => {
    container = container || new Container();
    container.bind(TYPES.UserMessager).to(UserMessager);
    container.bind(TYPES.TransformManager).to(ContentTransformManager);
    container.bind(TYPES.PathTransformManager).to(PathTransformManager);
    container.bind(TYPES.FilePatterns).to(FilePatterns);
    container.bind(TYPES.SettingsType).toDynamicValue(() => Settings);
    container.bind(TYPES.FSTreeProcessor).to(TreeTransformer);
    container.bind(TYPES.TemplateDiscoverer).to(TemplateDiscoverer);
    container.bind(TYPES.Mapper).to(Mapper);
    container.bind(TYPES.Regexer).to(Regexer);
    container.bind(TYPES.i18n).toConstantValue(i18nTranslate || ((v) => v));
    return container;
};
//# sourceMappingURL=container-builder.js.map