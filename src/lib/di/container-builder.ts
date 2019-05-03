import { Container } from "inversify";
import 'reflect-metadata';
import { FilePatterns } from '../file-patterns';
import { TemplateDiscoverer, ITemplateDiscoverer } from "../discoverer";
import { TreeTransformer } from "../transformer/tree-transformer";
import { PathTransformManager, ContentTransformManager } from '../transformers';
import { UserMessager } from '../user-messager';
import TYPES from "./types";
import { IRegexer } from '../util/i-regexer';
import { Regexer } from '../util/regexer';
import { Ii18nFunction, IUserMessager, IFilePatterns } from '../i';
import { ITransformManager, IPathTransformManager } from '../transformers/i';
import { Settings } from '../models';
import { ITreeTransformer } from "../transformer";
import { Mapper } from "../mapper";


export const containerBuilder = (
    container?: Container,
    i18nTranslate: Ii18nFunction = null
): Container => {
    container = container || new Container();
    container.bind<IUserMessager>(TYPES.UserMessager).to(UserMessager);
    container.bind<ITransformManager>(TYPES.TransformManager).to(ContentTransformManager);
    container.bind<IPathTransformManager>(TYPES.PathTransformManager).to(PathTransformManager);
    container.bind<IFilePatterns>(TYPES.FilePatterns).to(FilePatterns);
    container.bind(TYPES.SettingsType).toDynamicValue(() => Settings);
    container.bind<ITreeTransformer>(TYPES.FSTreeProcessor).to(TreeTransformer);
    container.bind<ITemplateDiscoverer>(TYPES.TemplateDiscoverer).to(TemplateDiscoverer);
    container.bind<Mapper>(TYPES.Mapper).to(Mapper);
    container.bind<IRegexer>(TYPES.Regexer).to(Regexer);

    container.bind<Ii18nFunction>(TYPES.i18n).toConstantValue(i18nTranslate || <Ii18nFunction>((v: string) => v));
    return container;
};