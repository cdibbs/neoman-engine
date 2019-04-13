import { AsyncTest, Setup, TestCase, FocusTests } from "alsatian";
import { Assert } from "alsatian-fluent-assertions";
import { IMock, Mock } from "typemoq";
import { RunOptions } from "../../models";
import { IInputConfig } from "../../user-extensibility";
import { ArgvInputManager } from "./argv-input-manager";
var NestedError = require('nested-error-stacks');

export class ArgvInputManagerTests {
    im: ArgvInputManager;

    @Setup
    public beforeEach() {
        this.im = new ArgvInputManager();
    }

    @TestCase({})
    @TestCase(null)
    @TestCase(undefined)
    @AsyncTest("ask() when no questions, returns empty dict.")
    async ask_whenNoQuestions_ReturnsEmpty(cfg: any) {
        var answers = await this.im.ask(cfg, <RunOptions>{ extraArgs: [ "one" ] });
        Assert(answers)
            .isEmpty();
    }

    @TestCase([])
    @TestCase(null)
    @TestCase(undefined)
    @AsyncTest("ask() empty extra args returns dict of empty properties.")
    async ask_whenNoArgs_ReturnsEmpty(args: string[]) {
        var answers = await this.im.ask(<IInputConfig>{
            define: {
                one: "Some question",
                two: "Another question"
            }
        }, <RunOptions>{ extraArgs: args });
        Assert(answers)
            .has({
                one: "",
                two: ""
            });
    }

    @TestCase(["a", "new", "list"])
    @AsyncTest("ask() fills defaults in order")
    async ask_whenNoFlags_fillsInOrder() {

    }
}