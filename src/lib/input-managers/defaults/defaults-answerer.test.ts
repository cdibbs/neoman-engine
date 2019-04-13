import { Setup, Test, TestCase } from "alsatian";
import { Assert } from "alsatian-fluent-assertions";
import { DefaultsAnswerer } from "./defaults-answerer";
import { IComplexInputDef } from "../../user-extensibility";
var NestedError = require('nested-error-stacks');

export class DefaultsAnswererTests {
    answerer: DefaultsAnswerer;

    @Setup
    public beforeEach() {
        this.answerer = new DefaultsAnswerer();
    }

    @Test("getDefault() returns template-defined default, when available.")
    getDefault_returnsDefaultWhenAvailable(): void {
        var answer = this.answerer.getDefault(<IComplexInputDef<any>>{ default: 321 });
        Assert(answer).equals(321);
    }

    @TestCase({})
    @TestCase("somestring")
    @Test("getDefault() returns generated default, when templated-defined not available.")
    getDefault_noTemplateDefault_returnsGeneratedDefault(val: string | IComplexInputDef<any>): void {
        var answer = this.answerer.getDefault(val);
        Assert(answer).matches(/NeomanAutogeneratedValue\d+/);
    }
}