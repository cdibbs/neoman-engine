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
export var containerBuilder = function (container, i18nTranslate) {
    if (i18nTranslate === void 0) { i18nTranslate = null; }
    container = container || new Container();
    container.bind(TYPES.UserMessager).to(UserMessager);
    container.bind(TYPES.TransformManager).to(ContentTransformManager);
    container.bind(TYPES.PathTransformManager).to(PathTransformManager);
    container.bind(TYPES.FilePatterns).to(FilePatterns);
    container.bind(TYPES.SettingsType).toDynamicValue(function () { return Settings; });
    container.bind(TYPES.FSTreeProcessor).to(TreeTransformer);
    container.bind(TYPES.TemplateDiscoverer).to(TemplateDiscoverer);
    container.bind(TYPES.Regexer).to(Regexer);
    container.bind(TYPES.i18n).toConstantValue(i18nTranslate || (function (v) { return v; }));
    return container;
};
//# sourceMappingURL=container-builder.js.map