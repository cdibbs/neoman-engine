
import { Setup, Test, TestFixture, FocusTests } from 'alsatian';
import { Assert } from 'alsatian-fluent-assertions';
import { IMock, Mock } from 'typemoq';
import { IFileSystem, IPath, IUserMessager, ITemplate } from "../../../src/lib/i";
import { mockMessagerFactory } from '../../../src/spec-lib';
import { MockConstructor } from '../../spec-lib/mock-constructor';
import { ITemplatePreprocessor } from './i-template-preprocessor';
import { SearchHandlerFactory } from './search-handler-factory';
import { ITemplatePathUtil } from './i-template-path-util';

@TestFixture("SearchHandlerFactory Tests")
export class SearchHandlerFactoryTests {
    msgr: IUserMessager;
    fsMock: IMock<IFileSystem>;
    pathUtilMock: IMock<ITemplatePathUtil>;
    tmplPrepMock: IMock<ITemplatePreprocessor>;
    inst: SearchHandlerFactory;

    @Setup
    public beforeEach() {
        const out = { mockConsole: <any>null };
        this.msgr = mockMessagerFactory({out: out});
        this.fsMock = Mock.ofType<IFileSystem>();
        this.pathUtilMock = Mock.ofType<ITemplatePathUtil>();
        this.tmplPrepMock = Mock.ofType<ITemplatePreprocessor>();
        this.inst = new SearchHandlerFactory(this.msgr, this.fsMock.object, this.pathUtilMock.object, this.tmplPrepMock.object);
        this.inst["hndClass"] = <any>MockConstructor;
    }

    @Test()
    build_returnsInstanceWithCorrectParams() {
        const testLocs = { "one": "one", "two": "two" }
        const tmpl: ITemplate[] = <any>["something"];
        const result: MockConstructor = <any>this.inst.build(testLocs, tmpl);
        Assert(result)
            .isDefined()
            .not.isNull()
            .has({
                cargs: [
                    this.msgr,
                    this.pathUtilMock.object,
                    this.fsMock.object,
                    this.tmplPrepMock.object,
                    tmpl,
                    testLocs
                ]
            });            
    }
}