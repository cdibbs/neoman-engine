
import { FocusTests, Setup, Test, TestCase, TestFixture } from 'alsatian';
import { Assert } from 'alsatian-fluent-assertions';
import { IMock, It, Mock, Times } from 'typemoq';
import { IFileSystem, ITemplate, IUserMessager } from "../../../src/lib/i";
import { mockMessagerFactory } from '../../../src/spec-lib';
import { EventEmitter, TemplateSearchEmitterType } from '../emitters';
import { ITemplatePathUtil } from './i-template-path-util';
import { ITemplatePreprocessor } from './i-template-preprocessor';
import { SearchHandler } from './search-handler';
import { TemplateManagerError } from './template-manager-error';

@TestFixture("SearchHandler Tests")
export class SearchHandlerTests {
    msgr: IUserMessager;
    fsMock: IMock<IFileSystem>;
    pathUtilMock: IMock<ITemplatePathUtil>;
    tmplPrepMock: IMock<ITemplatePreprocessor>;
    emitterMock: IMock<EventEmitter<TemplateSearchEmitterType>>;
    inst: SearchHandler;
    tref: ITemplate[];

    @Setup
    public beforeEach() {
        const out = { mockConsole: <any>null };
        this.tref = [];
        this.msgr = mockMessagerFactory({out: out});
        this.fsMock = Mock.ofType<IFileSystem>();
        this.pathUtilMock = Mock.ofType<ITemplatePathUtil>();
        this.tmplPrepMock = Mock.ofType<ITemplatePreprocessor>();
        this.emitterMock = Mock.ofType<EventEmitter<TemplateSearchEmitterType>>();
        this.inst = new SearchHandler(this.msgr, this.pathUtilMock.object, this.fsMock.object, this.tmplPrepMock.object, this.tref, {});
    }

    @TestCase({a: true, b: false, c: false}, "c", false)
    @TestCase({a: true, b: false, c: true}, "b", true)
    @TestCase({a: false, b: false, c: false}, "c", false)
    @Test()
    endList_onlyEmitsAfterAllSearchesComplete(completed: { [key: string]: boolean }, change: string, emits: boolean) {
        this.inst["completedSearches"] = completed; //Object.assign({}, completed);
        this.inst["locations"] = { "a": "a", "b": "b", "c": "c" };
        this.inst.endList(this.emitterMock.object, change);

        this.emitterMock
            .verify(m => m.emit('end', this.tref), Times.exactly(emits ? 1 : 0));
    }

    @Test()
    templateMatch_catchesAndEmitsErrors() {
        const tmplDir = "/tmp/testdir";
        const file = ".neoman.config/bogus.txt";
        this.pathUtilMock
            .setup(m => m.determineTemplateFileFullPath(It.isAnyString(), It.isAnyString()))
            .throws(new Error());

            this.inst.templateMatch(this.emitterMock.object, tmplDir, file);

        this.emitterMock
            .verify(m => m.emit("match", It.isAny()), Times.never());
        this.emitterMock
            .verify(m => m.emit("error", It.is(e => e instanceof TemplateManagerError)), Times.once());
    }

    @Test()
    templateMatch_correctlyBuildsTemplateFromDesiredPaths() {
        const tmplDir = "/tmp/testdir";
        const file = ".neoman.config/bogus.txt";
        const fileFull = "/tmp/testdir/.neoman.config/bogus.txt";
        const tmplRoot = "/tmp/testdir/";
        const confRoot = "/tmpl/testdir/user-configed-root/";
        this.tmplPrepMock
            .setup(m => m.preprocess(It.isAny()))
            .returns(_ => <any>{ fake: 123 });
        this.fsMock
            .setup(m => m.readFileSync(fileFull, "utf8"))
            .returns(_ => "{}");
        this.pathUtilMock
            .setup(m => m.determineTemplateFileFullPath(tmplDir, file))
            .returns(_ => fileFull);
        this.pathUtilMock
            .setup(m => m.determineTemplateRootPath(fileFull))
            .returns(_ => tmplRoot);
        this.pathUtilMock
            .setup(m => m.determineConfiguredRoot(tmplRoot, undefined))
            .returns(_ => confRoot);
        this.inst.templateMatch(this.emitterMock.object, tmplDir, file);

        this.emitterMock
            .verify(m => m.emit("error", It.isAny()), Times.never());
        this.emitterMock
            .verify(m => m.emit("match", It.is(t => {
                Assert(t).has(
                    <typeof t & { fake: number }>
                    {
                        fake: 123,
                        __tmplPath: confRoot,
                        __tmplConfigPath: tmplRoot,
                        __tmplRepo: tmplDir 
                    }
                );
                return true;
            })), Times.once());
    }

    @TestCase(1)
    @TestCase(3)
    @TestCase(7)
    @Test()
    public endList_sendsAllDiscoveredTemplates(n: number) {
        this.fsMock
            .setup(m => m.readFileSync(It.isAny(), "utf8"))
            .returns(_ => "{}");
        this.tmplPrepMock
            .setup(m => m.preprocess(It.isAny()))
            .returns(_ => <any>{ fake: 123 });

        for (let i=0; i<n; i++) {
            this.inst.templateMatch(this.emitterMock.object, "/tmp/someplace", "somefile.txt");
        }
        this.inst["locations"] = { somekey: "something" };
        this.inst["completedSearches"] = { somekey: true };
        this.inst.endList(this.emitterMock.object, "somekey");

        this.emitterMock.verify(m => m.emit('end', It.is(l => l.length == n)), Times.once());
    }
}