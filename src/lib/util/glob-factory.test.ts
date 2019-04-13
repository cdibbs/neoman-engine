import { GlobFactory } from "./glob-factory";
import { Mock } from "typemoq";
import { IOptions, Glob } from "glob";
import { Assert } from "alsatian-fluent-assertions";
import { Test } from "alsatian";

export class GlobFactoryTests {
    @Test()
    build_usesGlob() {
        const gf = new GlobFactory();
        Assert(gf["globClass"]).deeplyEquals(Glob);
    }
    
    @Test()
    build_returnsGlobInstance() {
        const gf = new GlobFactory();
        gf["globClass"] = <any>GlobTestClass;
        const testPtrn = "my pattern";
        const testOpts = <any>{ opts: "my opts" };
        const result = gf.build(testPtrn, testOpts);

        Assert(result)
            .has(r => r["ptrn"]).that.equals(testPtrn).kThx
            .has(r => r["opts"]).that.equals(testOpts);
    }
}

export class GlobTestClass {
    constructor(public ptrn: string, public opts: IOptions) {}
}