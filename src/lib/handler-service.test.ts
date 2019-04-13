import { Setup, Test, TestFixture, FocusTest, FocusTests, TestCase, AsyncTest } from 'alsatian';
import { Assert } from 'alsatian-fluent-assertions';
import { FilePatterns } from './file-patterns';
import { HandlerService } from './handler-service';
import { access } from 'fs-extra';
import { IMock, Mock, Times, It } from 'typemoq';
import { IPath } from './i';
import { mockMessagerFactory } from '../spec-lib';
import * as fse from 'fs-extra';
import { UserMessager } from './user-messager';


@TestFixture("Handler Service tests")
export class HandlerServiceTests {
    hs: HandlerService;
    pathMock: IMock<IPath>;
    accessMock: IMock<(p: string | Buffer, mode?: number) => Promise<void>>;
    requireMock: IMock<NodeRequire>;
    msgr: UserMessager;

    @Setup
    public beforeEach() {
        this.pathMock = Mock.ofType<IPath>();
        this.accessMock = Mock.ofInstance((p: string | Buffer, mode?: number) => Promise.resolve());
        this.requireMock = Mock.ofType<NodeRequire>();
        this.msgr = mockMessagerFactory();
        this.hs = new HandlerService(this.pathMock.object, this.msgr);
        // be reasonably sure:
        Assert(this.hs["requireNative"])
            .is(Function)
            .hasKeys(["resolve", "cache", "extensions", "main"]);
        this.hs["requireNative"] = this.requireMock.object;
        Assert(this.hs["access"]).equals(access);
        this.hs["access"] = <any>this.accessMock.object;
    }

    @AsyncTest()
    async resolveAndLoad_buildsAndUsesCorrectHandlerPath() {
        const tmplRoot = "root";
        const handlerName = "handlername";
        const ensureSupportedResult = "ejsResult";
        const pathResult = "path result";
        const filePathResult = "file path result";

        const ensureSupportedMock = Mock.ofInstance((p: string, f: string) => "");
        ensureSupportedMock
            .setup(e => e(pathResult, handlerName))
            .returns(() => ensureSupportedResult);
        this.hs["ensureSupportedFormat"] = ensureSupportedMock.object;
        this.pathMock
            .setup(p => p.join(tmplRoot, '.neoman.config', 'handlers'))
            .returns(() => pathResult);
        this.pathMock
            .setup(p => p.join(pathResult, ensureSupportedResult))
            .returns(() => filePathResult);
        const fromPathMock = Mock.ofInstance((p: string) => Promise.resolve());
        this.hs["resolveAndLoadFromPath"] = <any>fromPathMock.object;

        await this.hs.resolveAndLoad(tmplRoot, handlerName);

        this.pathMock.verify(p => p.join(tmplRoot, '.neoman.config', 'handlers'), Times.once());
        this.pathMock.verify(p => p.join(pathResult, ensureSupportedResult), Times.once());
        fromPathMock.verify(p => p(filePathResult), Times.once());
    }

    @AsyncTest()
    async resolveAndLoadFromPath_awaitsAccessCheck_thenReturnsHandler() {
        const path = "/tmp/my path";
        const aFunc = new Function();
        this.accessMock
            .setup(a => a(path, fse.constants.R_OK))
            .returns(() => Promise.resolve());
        this.requireMock
            .setup(r => r(path))
            .returns(() => aFunc);

        const result = await this.hs["resolveAndLoadFromPath"](path);

        Assert(result).strictlyEquals(aFunc);
    }

    @AsyncTest()
    async resolveAndLoadFromPath_onError_wrapsAndRethrows() {
        const err = new Error();
        this.accessMock
            .setup(m => m(It.isAny(), It.isAny()))
            .throws(err);
        
        const lambda = async() => await this.hs["resolveAndLoadFromPath"]("/tmp/some/path");
        (await Assert(lambda)
            .throwsAsync()).that
                .has(e => e.message).that.matches(/Could not access/).kThx
                .has(e => e["nested"]).that.equals(err);
    }

    @AsyncTest()
    async resolveAndLoadFromPath_ifNotAFunction_throws() {
        const path = "/tmp/some/path";
        this.requireMock
            .setup(m => m(It.isAnyString()))
            .returns(() => 123);

        const lambda = async() => await this.hs["resolveAndLoadFromPath"](path);
        (await Assert(lambda)
            .throwsAsync()).that
                .has(e => e.message).that
                    .matches(/Handler definition/)
                    .contains(path)
                    .matches(/was not a function/);
    }

    @TestCase("somefile")
    @TestCase("somefile.js")
    @Test("ensureSupportedFormat adds .js extension, if not present.")
    public ensureSupportedFormat_appendsJsWhenAppropriate(file: string) {
        const result = this.hs["ensureSupportedFormat"]("", file);
        Assert(result).equals("somefile.js");
    }
}