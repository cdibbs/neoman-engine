import { FocusTests, Setup, Test, TestFixture, TestCase } from "alsatian";
import { Assert } from "alsatian-fluent-assertions";
import { IMock, It, Mock } from "typemoq";
import { mockMessagerFactory } from '../../../src/spec-lib';
import { IFileSystem, IPath, IUserMessager } from "../i";
import { TemplatePathUtil } from "./template-path-util";

@TestFixture("Template Path Utility Tests")
export class TemplatePathUtilTests {
    inst: TemplatePathUtil;
    msgr: IUserMessager;
    pathMock: IMock<IPath>;
    fsMock: IMock<IFileSystem>;

    @Setup
    beforeEach() {
        const out = { mockConsole: <any>null };
        this.msgr = mockMessagerFactory({out: out});
        this.pathMock = Mock.ofType<IPath>();
        this.fsMock = Mock.ofType<IFileSystem>();
        this.inst = new TemplatePathUtil(this.msgr, this.pathMock.object, this.fsMock.object);
    }

    @Test()
    determineTemplateFileFullPath_returnsFullPathOfRelativeFile() {
        const root = "/tmp/something/";
        const file = "some/file.txt";
        this.pathMock
            .setup(m => m.join(It.isAny(), It.isAny()))
            .returns((...args: []) => args.join(""));
        const result = this.inst.determineTemplateFileFullPath(root, file);
        Assert(result).equals(root + file);
    }

    @Test()
    determineTemplateRootPath_returnsTheFilesGrandparentDirectory() {
        const file = "/tmp/some/file.txt";
        const dir = "/tmp/some/";
        this.pathMock
            .setup(m => m.join(dir, It.isAny()))
            .returns((...args: []) => args.join(""));
        this.pathMock
            .setup(m => m.dirname(file))
            .returns(_ => dir);
        const result = this.inst.determineTemplateRootPath(file);
        Assert(result).equals(dir + "..");
    }

    @TestCase({}, "/tmp/defaultroot/")
    @TestCase({root: "something"}, "/tmp/defaultroot/something")
    @Test()
    determineConfiguredRoot_choosesUserRootWhenAvailable(tmpl: any, expected: string) {
        const defRoot = "/tmp/defaultroot/";
        this.pathMock
            .setup(m => m.join(It.isAnyString(), It.isAnyString()))
            .returns((a, b) => a+b);
        this.fsMock
            .setup(m => m.statSync(It.isAnyString()))
            .returns(_ => <any>{ isDirectory: true });
        const result = this.inst.determineConfiguredRoot(defRoot, tmpl["root"]);
        Assert(result).equals(expected);
    }

    @Test()
    determineConfiguredRoot_errorsWhenNotDirectory() {
        const defRoot = "/tmp/defaultroot";
        this.pathMock
            .setup(m => m.join(It.isAnyString(), It.isAnyString()))
            .returns((a, b) => a+b);
        this.fsMock
            .setup(m => m.statSync(It.isAnyString()))
            .returns(_ => <any>{ isDirectory: false });
        const lambda = () => this.inst.determineConfiguredRoot(defRoot, undefined);
        Assert(lambda).throws()
            .that.has("message").that
                .matches(/not a directory/)
                .contains(defRoot);
    }

    @TestCase(123)
    @TestCase(null)
    @TestCase(true)
    @TestCase({})
    @Test()
    determineConfiguredRoot_ErrorsWhenNotString(input: string) {
        const defRoot = "/tmp/defaultroot";
        this.pathMock
            .setup(m => m.join(It.isAnyString(), It.isAnyString()))
            .returns((a, b) => a+b);
        this.fsMock
            .setup(m => m.statSync(It.isAnyString()))
            .returns(_ => <any>{ isDirectory: true });
        const lambda = () => this.inst.determineConfiguredRoot(defRoot, input);
        Assert(lambda).throws()
            .that.has("message").that
                .matches(/must be a string/)
                .matches(/JsonPath: \$\.root/);
    }
}