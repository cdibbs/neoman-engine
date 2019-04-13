// 3rd party imports installed via npm install
import { Test, TestFixture, AsyncTest, TestCase, TestCases, AsyncSetup, AsyncTeardown, Teardown, Setup } from 'alsatian';
import { IMock, Mock, It, Times } from 'typemoq';

import { TemplateValidator } from './template-validator';
import { PLUGIN_PREFIX } from './constants';
import { IUserMessager, IErrorReporter } from './i';
import { CommandValidationResult, CommandErrorType } from "./models";
import { Assert } from 'alsatian-fluent-assertions';

@TestFixture("Template Validator Tests")
export class TemplateValidatorTests {
    validator: TemplateValidator;
    requiregMock: IMock<any>;

    @Setup
    public beforeEach() {
        this.validator = new TemplateValidator();
        this.requiregMock = Mock.ofInstance({ resolve: ()=>{} });
        this.validator.requireg = this.requiregMock.object;
    }

    @Test("should build dictionary of installed dependencies.")
    public dependenciesInstalled_buildsDictionaryOfInstalledDeps(err: Error | string, expMsg: string, errorTimes: number, infoTimes: number) {
        let config = {
            configurations: {
                "one": { plugin: "something" },
                "two": { plugin: "missing" }
            }
        }
        this.requiregMock.setup(m => m.resolve(It.isValue(PLUGIN_PREFIX + "something"))).returns(() => "");
        this.requiregMock.setup(m => m.resolve(It.isValue(PLUGIN_PREFIX + "missing"))).throws(new Error("missing plugin!"));

        let result = this.validator.dependenciesInstalled(<any>config);

        let a = Assert(result);
        a.hasProperty(PLUGIN_PREFIX + "something").that.equals(true);
        a.hasProperty(PLUGIN_PREFIX + "missing").that.equals(false);
    }
}