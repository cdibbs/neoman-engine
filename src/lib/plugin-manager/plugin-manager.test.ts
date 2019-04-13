import { Test, Setup, TestCase } from "alsatian";
import { PluginManager } from "./plugin-manager";
import { IUserMessager } from "../i";
import { mockMessagerFactory } from "../../spec-lib";
import { Assert, MatchMode, LocationMode } from "alsatian-fluent-assertions";
import { IMock, Mock, Times, It } from "typemoq";
import { TemplateConfiguration } from "../transformers/models/configuration";
import { ISubjectDefinition } from "../user-extensibility/template/i-subject-definition";
import { ITransformPlugin } from "../user-extensibility";

export class PluginManagerTests {
    pm: PluginManager;
    msgr: IUserMessager;
    mockRequire: IMock<(key: string) => any>;
    requireTestReturn: { new(...args: any[]): any };

    @Setup
    beforeEach() {
        this.msgr = mockMessagerFactory();
        this.requireTestReturn = MockPluginClass;
        this.mockRequire = Mock.ofInstance((k: string) => {});
        this.mockRequire
            .setup(r => r(It.isAnyString()))
            .returns(() => this.requireTestReturn);
        this.pm = new PluginManager(this.msgr, { version: "1.2.3" });
        this.pm["requireg"] = this.mockRequire.object;
    }

    @TestCase(undefined)
    @TestCase(null)
    @TestCase({})
    @Test()
    preparePlugins_yieldsEmptyPluginsFromEmptyDef(def: any) {
        Assert(this.pm.listPlugins())
            .isEmpty();
    }

    @Test()
    preparePlugins_shouldLoadPlugin() {
        const testConfig = { one: { plugin: "myplug" } };
        this.pm.preparePlugins(<any>testConfig);
        const plugins = this.pm.listPlugins();

        Assert(plugins)
            .hasElements([
                (p: TemplateConfiguration) => p.plugin === "myplug"
            ]);
        this.mockRequire.verify(r => r("neoman-plugin-myplug"), Times.once());
    }

    @TestCase({ one: "here" }, "here")
    @TestCase({ one: "again"} , "again")
    @Test()
    getConfig_returnsConfiguration(plugins: any, p: any) {
        Assert(this.pm["plugins"]).isDefined();
        this.pm["plugins"] = plugins;
        Assert(this.pm.getConfig("one"))
            .equals(p);
    }

    @TestCase({ one: "here" }, true)
    @TestCase({} , false)
    isPluginDefined_returnsCorrectBool(plugins: any, def: boolean) {
        Assert(this.pm["plugins"]).isDefined();
        this.pm["plugins"] = plugins;
        Assert(this.pm.isPluginDefined("one"))
            .equals(def);
    }

    @TestCase(undefined)
    @TestCase(null)
    @Test()
    loadPlugin_noSettings_NoOp(val: any) {
        this.pm["loadPlugin"](<any>{ plugin: val });
        this.mockRequire.verify(r => r(It.isAnyString()), Times.never());
    }

    @Test()
    loadPlugin_requiregError_wrapsRethrows() {
        this.mockRequire.reset();
        this.mockRequire
            .setup(r => r(It.isAny()))
            .throws(new Error());
        const fakeConfig = <any>{ plugin: "someplugin", npmPluginName: "neoman-plugin-someplugin" };
        const lambda = () => this.pm["loadPlugin"](fakeConfig);
        Assert(lambda)
            .throws()
            .that.has(e => e.message)
                .that.matches(/Error loading plugin/);
    }

    @Test()
    loadPlugin_instantiationError_wrapsRethrows() {
        this.mockRequire.reset();
        this.mockRequire
            .setup(r => r(It.isAny()))
            .returns(() => MockPluginInstantiationErrorClass);
        const fakeConfig = <any>{ plugin: "someplugin", npmPluginName: "neoman-plugin-someplugin" };
        const lambda = () => this.pm["loadPlugin"](fakeConfig);
        Assert(lambda)
            .throws()
            .that.has(e => e.message).that
                .matches(/Error instantiating plugin/)
                .matches(/neoman-plugin-someplugin/);
    }

    @Test()
    async configurePlugin_pluginError_wrapsRethrows() {
        const mockConfigure = Mock.ofInstance((a: any, b: any) => {});
        mockConfigure
            .setup(c => c(It.isAny(), It.isAny()))
            .throws(new Error());
        const mockPlugin = {
            npmPluginName: "something",
            pluginInstance: {
                configure: mockConfigure.object
            }
        }
        const lambda = async () => await this.pm["configurePlugin"](<any>mockPlugin, <any>{});

        (await Assert(lambda)
            .throwsAsync())
            .that.has(e => e.message).that
                .matches(/Error calling .configure/)
                .contains(mockPlugin.npmPluginName);

    }

    @Test()
    async configurePlugin_awaitsConfigure() {
        const mockPromise = Mock.ofInstance({ then: (a: Function) => {} });
        const mockConfigure = Mock.ofInstance((a: any, b: any) => {});
        mockConfigure
            .setup(c => c(It.isAny(), It.isAny()))
            .returns(() => mockPromise.object);
        const mockPlugin = {
            npmPluginName: "something",
            pluginInstance: {
                configure: mockConfigure.object
            }
        }
        await this.pm["configurePlugin"](<any>mockPlugin, <any>{});
        mockPromise.verify(p => p.then(It.isAny()), Times.once());
    }
}

class MockPluginClass implements ITransformPlugin {
    async transform(path: string, original: string, subject: string | ISubjectDefinition, transformOrTransformer: string | ((subj: string) => string), pluginOptions: any):
        Promise<string> {
        throw new Error("Method not implemented.");
    }

    constructor(...args: any[]) {}
    async configure(pluginOptions: any): Promise<void> {
        return;
    }
}

class MockPluginInstantiationErrorClass implements ITransformPlugin {
    async transform(path: string, original: string, subject: string | ISubjectDefinition, transformOrTransformer: string | ((subj: string) => string), pluginOptions: any):
        Promise<string> {
        throw new Error("Method not implemented.");
    }

    constructor(...args: any[]) {
        throw new Error("whoa!");
    }
    async configure(pluginOptions: any): Promise<void> {
        return;
    }
}