import { AsyncTest, Setup, TestCase } from "alsatian";
import { Assert } from "alsatian-fluent-assertions";
import { IMock, Mock } from "typemoq";
import { RunOptions } from "../../models";
import { IInputConfig, IComplexInputDef } from "../../user-extensibility";
import { DefaultsInputManager } from "./defaults-input-manager";
import { IDefaultsAnswerer } from "./i-defaults-answerer";
var NestedError = require('nested-error-stacks');

export class DefaultsInputManagerTests {
    im: DefaultsInputManager;
    answererMock: IMock<IDefaultsAnswerer>;

    @Setup
    public beforeEach() {
        this.answererMock = Mock.ofType<IDefaultsAnswerer>();
        this.im = new DefaultsInputManager(this.answererMock.object);
        this.im["tmplRootPath"] = "something";
    }

    @TestCase({})
    @TestCase(null)
    @TestCase(undefined)
    @AsyncTest("ask() when no questions, returns empty dict.")
    async ask_whenNoQuestions_ReturnsEmpty(cfg: any) {
        var answers = await this.im.ask(cfg, <RunOptions>{});
        Assert(answers)
            .isEmpty();
    }

    @AsyncTest("ask() when questions, iterate and get defaults.")
    async ask_whenQuestions_getDefaultForEach() {
        const inputConfig = <IInputConfig>{
            define: {
                one: "something",
                two: "another thing",
                three: <IComplexInputDef<any>>{ default: 123}
            }
        };
        const vals = Object.keys(inputConfig.define).map(k => inputConfig.define[k]);
        vals.map(
            v => this.answererMock
                .setup(x => x.getDefault(v))
                .returns(() => "bogus"));

        var answers = await this.im.ask(inputConfig, <RunOptions>{});
        Assert(answers)
            .hasKeys(Object.keys(inputConfig.define));        
        this.answererMock
            .verifyAll();
    }
}