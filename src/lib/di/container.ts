import * as fs from 'fs';
import * as glob from 'glob';
import * as i18n from 'i18n';
import { Container } from "inversify";
import * as osLocale from 'os-locale';
import * as path from 'path';
import 'reflect-metadata';
import { IMapperService, MapperService } from 'simple-mapper';
import { ErrorReporter } from '../error-reporter';
import { FilePatterns } from '../file-patterns';
import { HandlerService } from '../handler-service';
import * as i from '../i';
import { CustomInputManager, DefaultsInputManager } from '../input-managers';
import * as m from '../models';
import { ITemplateManager, TemplateManager, ITemplatePreprocessor } from "../template-management";
import { FSTreeProcessor } from "../template-runner";
import { IFSTreeProcessor, ITreeDiscoveryEventHandler } from "../template-runner/i";
import { TemplateValidator } from '../template-validator';
import { PathTransformManager, ContentTransformManager } from '../transformers';
import * as it from '../transformers/i';
import { UserMessager } from '../user-messager';
import { GlobFactory } from "../util/glob-factory";
import { IGlobFactory } from "../util/i-glob-factory";
import { SettingsProvider } from "./entities";
import TYPES from "./types";
import { IDefaultsAnswerer } from '../input-managers/defaults/i-defaults-answerer';
import { DefaultsAnswerer } from '../input-managers/defaults/defaults-answerer';
import { IPluginManager } from '../plugin-manager/i-plugin-manager';
import { PluginManager } from '../plugin-manager/plugin-manager';
import { TemplatePreprocessor } from '../template-management/template-preprocessor';
import { ISearchHandlerFactory } from '../template-management/i-search-handler-factory';
import { SearchHandlerFactory } from '../template-management/search-handler-factory';
import { ISimpleTransformer, ToLocaleLowerCaseTransform, ToLocaleUpperCaseTransform, ToUpperCaseTransform, ToLowerCaseTransform } from '../input-managers/transforms/lib';
import { IBuiltinTransforms } from '../input-managers/transforms/i-builtin-transforms';
import { BuiltinTransforms } from '../input-managers/transforms/buildin-transforms';
import { IRegexer } from '../util/i-regexer';
import { Regexer } from '../util/regexer';
import { ITemplatePathUtil } from '../template-management/i-template-path-util';
import { TemplatePathUtil } from '../template-management/template-path-util';


export const containerBuilder = (packageJson: any = null, localesPath?: string): Container => {
    let json = packageJson || require(path.join(path.dirname(__filename), "../../package.json"));

    var container = new Container();
    container.bind<NodeJS.Process>(TYPES.Process).toDynamicValue(() => process);
    container.bind<i.IPackage>(TYPES.PackageJson).toConstantValue(json);
    container.bind<i.ISettingsProvider>(TYPES.SettingsProvider).to(SettingsProvider);
    container.bind<i.IHandlerService>(TYPES.HandlerService).to(HandlerService);
    container.bind<i.IUserMessager>(TYPES.UserMessager).to(UserMessager);
    container.bind<ITemplateManager>(TYPES.TemplateManager).to(TemplateManager);
    container.bind<it.ITransformManager>(TYPES.TransformManager).to(ContentTransformManager);
    container.bind<it.IPathTransformManager>(TYPES.PathTransformManager).to(PathTransformManager);
    container.bind<i.ITemplateValidator>(TYPES.TemplateValidator).to(TemplateValidator);
    container.bind<i.IFilePatterns>(TYPES.FilePatterns).to(FilePatterns);
    container.bind<i.IInputManager>(TYPES.CustomInputManager).to(CustomInputManager);
    container.bind<i.IInputManager>(TYPES.DefaultsInputManager).to(DefaultsInputManager);
    container.bind<IDefaultsAnswerer>(TYPES.DefaultsAnswerer).to(DefaultsAnswerer);
    container.bind<IMapperService>(TYPES.Mapper).toDynamicValue(() => new MapperService());
    container.bind<i.IErrorReporter>(TYPES.ErrorReporter).to(ErrorReporter);
    container.bind(TYPES.SettingsType).toDynamicValue(() => m.Settings);
    container.bind<IFSTreeProcessor>(TYPES.FSTreeProcessor).to(FSTreeProcessor);
    container.bind<IPluginManager>(TYPES.PluginManager).to(PluginManager);
    container.bind<ITemplatePreprocessor>(TYPES.TemplatePreprocessor).to(TemplatePreprocessor);
    container.bind<ISearchHandlerFactory>(TYPES.SearchHandlerFactory).to(SearchHandlerFactory);
    container.bind<ITemplatePathUtil>(TYPES.TemplatePathUtil).to(TemplatePathUtil);

    container.bind<ISimpleTransformer>(TYPES.SimpleTransformer).to(ToLocaleLowerCaseTransform);
    container.bind<ISimpleTransformer>(TYPES.SimpleTransformer).to(ToLocaleUpperCaseTransform);
    container.bind<ISimpleTransformer>(TYPES.SimpleTransformer).to(ToUpperCaseTransform);
    container.bind<ISimpleTransformer>(TYPES.SimpleTransformer).to(ToLowerCaseTransform);

    container.bind<IBuiltinTransforms>(TYPES.BuiltinTransforms).to(BuiltinTransforms);
    container.bind<IRegexer>(TYPES.Regexer).to(Regexer);


    let lobj = <typeof i18n>{};
    i18n.configure({
        defaultLocale: 'en_US',
        directory: localesPath || path.join(__dirname, '..', "/locales"),
        register: lobj
    });
    let lang = osLocale.sync();
    i18n.setLocale(lang);
    container.bind<i.Ii18nFunction>(TYPES.i18n).toConstantValue(lobj.__mf);
    container.bind<i.IPath>(TYPES.Path).toConstantValue(path);
    container.bind<i.IFileSystem>(TYPES.FS).toConstantValue(fs);
    container.bind<IGlobFactory>(TYPES.GlobFactory).to(GlobFactory);
    return container;
};