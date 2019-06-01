import { TestFixture, Setup, Test, TestCase, AsyncTest } from "alsatian";
import { TemplateDiscoverer } from "./template-discoverer";
import { IUserMessager } from "../i";
import { of } from "rxjs";
import { TemplateContentFile } from "../models";
import { Assert } from "alsatian-fluent-assertions";
import { FilePatterns } from "../file-patterns";

@TestFixture("TemplateDiscoverer Tests")
export class TemplateDiscovererTest {
    msgr: IUserMessager;
    inst: TemplateDiscoverer;

    @Setup
    public beforeEach() {
        this.inst = new TemplateDiscoverer(new FilePatterns());
    }

    /**
     * Note: different globbers handle patterns differently, so these
     * tests should integration-testing their dependency, somewhat.
     */
    @TestCase("\\temp\\myproject\\.neoman.config\\template.json", true)
    @TestCase("c:\\temp\\myproject\\.neoman.config\\template.json", true)
    @TestCase("myproject\\.neoman.config\\template.json", true)
    @TestCase(".neoman.config\\template.json", true)
    @TestCase(".neoman.config/template.json", true)
    @TestCase("myproject/.neoman.config/template.json", true)
    @TestCase("myproject/.neoman.config/template.json", true)
    @TestCase("/temp/myproject/.neoman.config/template.json", true)
    @TestCase("/temp/myproject/template.json", false)
    @TestCase("/myproject/template.json", false)
    @TestCase("/template.json", false)
    @TestCase("template.json", false)
    @TestCase(".neoman.config/", false)
    @TestCase(".neoman.config/something.json", false)
    @TestCase("/temp/myproject/.neoman.config", false)
    @AsyncTest()
    async find_matchesOnlyTemplatesAtAnyLevel(path: string, shouldMatch: boolean) {
        const one = new TemplateContentFile();
        one.absolutePath = path;
        const found = await this.inst.find(of(one)).toPromise();
        Assert(found).maybe(shouldMatch).isDefined();
    }
}
