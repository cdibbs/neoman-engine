import { Test, Setup, Expect, AsyncTest } from "alsatian";
import { CustomInputManager } from "..";
import { IHandlerService } from "../../i";
import { IMock, Mock, Times, It } from "typemoq";
import { RunOptions } from "../../models";
import { Assert } from "alsatian-fluent-assertions";
import { IInputConfig } from "../../user-extensibility";
var NestedError = require('nested-error-stacks');

export class CustomInputManagerTests {
    cim: CustomInputManager;
    handlerServiceMock: IMock<IHandlerService>;

    @Setup
    public beforeEach() {
        this.handlerServiceMock = Mock.ofType<IHandlerService>();
        this.cim = new CustomInputManager(this.handlerServiceMock.object);
        this.cim["tmplRootPath"] = "something";
    }

    @AsyncTest("ask() resolves handler from tmplRootPath and calls the handler with the input config")
    async ask_resolvesHandler() {
        const inputConfig = {
            handler: "myhandler"
        };
        const runOpts: RunOptions = <any>{ verbosity: "debug" };
        const handlerMock = Mock.ofInstance((i: IInputConfig) => {});
        this.handlerServiceMock
            .setup(x => x.resolveAndLoad(It.isAnyString(), It.isAnyString()))
            .returns(() => Promise.resolve(handlerMock.object));

        const result = await this.cim.ask(inputConfig, runOpts);
        this.handlerServiceMock.verify(x => x.resolveAndLoad(this.cim["tmplRootPath"], inputConfig.handler), Times.once());
        handlerMock.verify(x => x(inputConfig), Times.once());
    }

    @AsyncTest("ask() rejects on error")
    async ask_rejectsOnError() {
        const testFn = async () => {
            await this.cim.ask({}, <any>{});
        };
        const myError = new Error();
        this.handlerServiceMock
            .setup(x => x.resolveAndLoad(It.isAny(), It.isAny()))
            .throws(myError);

        (await Assert(testFn)
            .throwsAsync())
            .that.is(NestedError)
                .has(e => e["nested"])
                .that.equals(myError);
    }
}