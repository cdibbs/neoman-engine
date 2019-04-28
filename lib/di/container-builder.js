"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
require("reflect-metadata");
var file_patterns_1 = require("../file-patterns");
var discoverer_1 = require("../discoverer");
var tree_transformer_1 = require("../transformer/tree-transformer");
var transformers_1 = require("../transformers");
var user_messager_1 = require("../user-messager");
var types_1 = require("./types");
var regexer_1 = require("../util/regexer");
var models_1 = require("../models");
exports.containerBuilder = function (container, i18nTranslate) {
    if (i18nTranslate === void 0) { i18nTranslate = null; }
    container = container || new inversify_1.Container();
    container.bind(types_1.default.UserMessager).to(user_messager_1.UserMessager);
    container.bind(types_1.default.TransformManager).to(transformers_1.ContentTransformManager);
    container.bind(types_1.default.PathTransformManager).to(transformers_1.PathTransformManager);
    container.bind(types_1.default.FilePatterns).to(file_patterns_1.FilePatterns);
    container.bind(types_1.default.SettingsType).toDynamicValue(function () { return models_1.Settings; });
    container.bind(types_1.default.FSTreeProcessor).to(tree_transformer_1.TreeTransformer);
    container.bind(types_1.default.TemplateDiscoverer).to(discoverer_1.TemplateDiscoverer);
    container.bind(types_1.default.Regexer).to(regexer_1.Regexer);
    container.bind(types_1.default.i18n).toConstantValue(i18nTranslate || (function (v) { return v; }));
    return container;
};
//# sourceMappingURL=container-builder.js.map