import { Test } from "alsatian";
import { Assert } from "alsatian-fluent-assertions";
import { RunOptions } from "../models";
import { IInputConfig } from "../user-extensibility";
import { BaseInputManager } from "./base-input-manager";

export class BaseInputManagerTests {
    @Test()
    constructor_setsTemplatePath() {
        const bim = new BogusInputManager();
        const testPath = "/tmp/something";
        bim.configure(testPath)
        Assert(bim)
            .has(o => o["tmplRootPath"])
            .that.equals(testPath);
    }
}

export class BogusInputManager extends BaseInputManager {
    protected tmplRootPath: string;
    configure(tmplRootPath: string): void {
        super.configure(tmplRootPath);
    }
    ask(config: IInputConfig, options: RunOptions): Promise<{ [key: string]: any; }> {
        throw new Error("Method not implemented.");
    }
}