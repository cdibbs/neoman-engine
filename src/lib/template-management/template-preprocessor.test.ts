import { FocusTests, Setup, Test, TestFixture } from 'alsatian';
import { Assert } from 'alsatian-fluent-assertions';
import { mockMessagerFactory } from '../../spec-lib';
import { IUserMessager } from '../i';
import { TemplatePreprocessor } from './template-preprocessor';
import { IRawTemplate } from '../user-extensibility/template';

@TestFixture("Template preprocessor tests")
export class TemplateRunnerTests {
    msgr: IUserMessager;
    prep: TemplatePreprocessor;

    @Setup
    public beforeEach() {
        const out = { mockConsole: <any>null };
        this.msgr = mockMessagerFactory({out: out});
        this.prep = new TemplatePreprocessor(this.msgr);
    }

    @Test()
    preprocess_includesFrozenRawTemplateAsChild() {
        const testTmplObj: IRawTemplate = {
            identity: "somekey",
            name: "A Template"
        };

        const result = this.prep.preprocess(testTmplObj);

        Assert(result).has(r => r.rawTemplate)
            .that.deepStrictlyEquals(testTmplObj);
        const lambdaCheckFrozen = () => result.rawTemplate["newprop"] = 123;
        Assert(lambdaCheckFrozen)
            .throws();
    }

    @Test()
    preprocess_removesArrayAndObjectComments() {
        const testTmplObj: IRawTemplate = {
            "#": "This is my template",
            identity: "somekey",
            name: "A Template",
            input: { 
                "#": "Another user comments about inputs"
            },
            transform: [
                "# Skip this one",
                { "subject": "/asdf/" },
                "/asdfasf/"
            ],
            pathTransform: [
                "# Skip me, please",
                "but not this"
            ]
        };

        const result = this.prep.preprocess(testTmplObj);
        Assert(result)
            .not.has(o => o["#"])
            .has(o => <any[]>o.transform).that
                .satisfies(arr => arr.length == 2)
                .allSatisfy((e: string) => typeof e !== "string" || ! e.startsWith("#"))
                .kThx
            .has(o => <any[]>o.pathTransform).that
                .satisfies(arr => arr.length == 1)
                .allSatisfy((e: string) => typeof e !== "string" || ! e.startsWith("#"))
                .kThx
            .has(o => o.input)
                .that.not.has(o => o["#"]);

    }

    @Test()
    preprocess_rootLevelElementMustNotBeArray() {
        const lambda = () => this.prep.preprocess(<any>[]);

        Assert(lambda).throws()
            .that.has(e => e.message)
            .that.matches(/Root-level.*cannot be an array/);
    }
}