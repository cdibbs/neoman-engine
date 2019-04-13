
import { AsyncTest, FocusTests, Setup, TestFixture, Test, TestCase } from 'alsatian';
import { Assert, LocationMode, MatchMode } from 'alsatian-fluent-assertions';
import { IMock, It, Mock, Times } from 'typemoq';
import { IFileSystem, IPath, ISettingsProvider, ITemplate, IUserMessager } from "../../../src/lib/i";
import { mockMessagerFactory } from '../../../src/spec-lib';
import { EventEmitter, TemplateSearchEmitterType } from '../emitters';
import { IEventEmitter } from '../emitters/i';
import { IGlobFactory } from '../util/i-glob-factory';
import { ISearchHandlerFactory } from './i-search-handler-factory';
import { TemplateManager } from './template-manager';
import { ISearchHandler } from './i-search-handler';
import { SearchHandler } from './search-handler';
import { SearchHandlerFactory } from './search-handler-factory';
import { ITemplatePreprocessor } from './i-template-preprocessor';
import { IGlob } from 'glob';
import { ITemplatePathUtil } from './i-template-path-util';
import { TemplateManagerError } from './template-manager-error';

@TestFixture("Template Manager Tests")
export class TemplateManagerTests {
    msgr: IUserMessager;
    inst: TemplateManager;
    settingsMock: IMock<ISettingsProvider>;
    fsMock: IMock<IFileSystem>;
    pathUtilMock: IMock<ITemplatePathUtil>;
    procMock: IMock<NodeJS.Process>;
    globFactoryMock: IMock<IGlobFactory>;
    tmplPrepMock: IMock<ITemplatePreprocessor>;
    searchHandlerFactory: ISearchHandlerFactory;

    @Setup
    public beforeEach() {
        const out = { mockConsole: <any>null };
        this.msgr = mockMessagerFactory({out: out});
        this.settingsMock = Mock.ofType<ISettingsProvider>();
        this.fsMock = Mock.ofType<IFileSystem>();
        this.pathUtilMock = Mock.ofType<ITemplatePathUtil>();
        this.procMock = Mock.ofType<NodeJS.Process>();
        this.globFactoryMock = Mock.ofType<IGlobFactory>();
        this.tmplPrepMock = Mock.ofType<ITemplatePreprocessor>();
        this.searchHandlerFactory = new SearchHandlerFactory(this.msgr,
            this.fsMock.object, this.pathUtilMock.object, this.tmplPrepMock.object);
        this.inst = new TemplateManager(this.settingsMock.object, this.msgr,
            this.procMock.object,
            this.globFactoryMock.object, this.searchHandlerFactory);
    }

    @Test()
    list_tracksAndReturnsAllTemplatesAtEnd() {
        const globbers: EventEmitter<{"match": {}, "end":{}}>[] = [];
        this.globFactoryMock
            .setup(m => m.build(It.isAnyString(), It.isAny()))
            .returns(_ => {
                const gm = new EventEmitter<{"match": {}, "end":{}}>();
                globbers.push(gm);
                return <any>gm; // fake Glob
            });
        this.fsMock
            .setup(m => m.readFileSync(It.isAny(), "utf8"))
            .returns(() => "{}");
        this.tmplPrepMock
            .setup(m => m.preprocess(It.isAny()))
            .returns((v) => <any>{ yep: 123 });
        const cbMock = Mock.ofInstance((t: ITemplate[]) => {});
        this.inst.list(cbMock.object);

        const mockTemplates = <ITemplate[]> <any> [ "some", "testfiles" ];
        globbers[0].emit("match", mockTemplates[0]);
        globbers[1].emit("match", mockTemplates[1]);
        globbers.map(g => g.emit("end", "bogus"));

        cbMock.verify(m => m(It.is(a => {
            Assert(a)
                .has(a => a.length).that.equals(2).kThx
                .allSatisfy(a => a.yep == 123);
            return true;
        })), Times.once());
    }

    @Test()
    list_setsUpSearchGlobsWithCorrectLocationAndPath() {
        const methodRef = this.inst["setupSearchGlob"];
        const sgMock = Mock.ofType<typeof methodRef>();
        this.inst["setupSearchGlob"] = sgMock.object;
        this.inst.list();

        for (let key in this.inst["searchLocations"]) {
            sgMock.verify(
                m => m(
                    key, this.inst["searchLocations"], It.is(sh => sh instanceof SearchHandler),
                    It.isAnyObject(EventEmitter), It.is(a => a instanceof Array)),
                Times.once())
        }
    }

    @Test()
    _setupSearchGlob_correctlyBindsParams() {
        const path = "/tmp/mypath";
        const ps = {};
        ps[path] = "something";
        const gm = Mock.ofType<IGlob>();
        this.globFactoryMock
            .setup(m => m.build(It.isAnyString(), It.isAny()))
            .returns(_ => gm.object);
        const shm = Mock.ofType<ISearchHandler>();
        const dem = new EventEmitter<TemplateSearchEmitterType>();
        const tmpl = <any>["mytemplates"];
        this.inst["setupSearchGlob"](path, ps, shm.object, dem, tmpl);

        this.globFactoryMock
            .verify(m => m.build(path, { cwd: ps[path] }), Times.once());
        gm.verify(m => m.on("match", It.is(sh => { sh("bogus"); return true; })), Times.once());
        gm.verify(m => m.on("end", It.is(sh => { sh(); return true; })), Times.once());
        shm.verify(m => m.templateMatch(dem, ps[path], "bogus"), Times.once());
        shm.verify(m => m.endList(dem, path), Times.once());
    }

    @AsyncTest()
    async list_collatesSources_sendsToMatch() {
        
    }

    @AsyncTest()
    async list_registersOptionalEmitters() {
        const ssgRef = this.inst["setupSearchGlob"];
        const ssgMock = Mock.ofType<typeof ssgRef>();
        this.inst["setupSearchGlob"] = ssgMock.object;
        const endm = Mock.ofInstance((t: ITemplate[]) => {});
        const errorm = Mock.ofInstance((te: TemplateManagerError) => {});
        const matchm = Mock.ofInstance((t: ITemplate) => {});
        const emitter = this.inst.list(endm.object, errorm.object, matchm.object);

        const ee = <EventEmitter<TemplateSearchEmitterType>> emitter;
        ee.emit("end", []);
        ee.emit("error", new TemplateManagerError(new Error(), ""));
        ee.emit("match", <any>{});
        endm.verify(f => f(It.isAny()), Times.once());
        errorm.verify(f => f(It.isAny()), Times.once());
        matchm.verify(f => f(It.isAny()), Times.once());
    }

    @AsyncTest()
    async list_anyErrorInSetup_sendsToError() {

    }

    @TestCase("*/.neoman.config/template.json")
    @TestCase(".neoman/**/.neoman.config/template.json")
    @AsyncTest()
    async list_searchesConfiguredTemplateRepos(repo: string) {
        const ssgRef = this.inst["setupSearchGlob"];
        const ssgMock = Mock.ofType<typeof ssgRef>();
        this.inst["setupSearchGlob"] = ssgMock.object;
        this.inst.list();

        ssgMock.verify(m => m(repo, this.inst["searchLocations"], It.isAny(), It.isAny(), It.isAny()), Times.once());
    }

    @AsyncTest()
    async info_returnsTemplateIfFound() {
        const toBeFound = { identity: "something" };
        const testEmitter = new EventEmitter<TemplateSearchEmitterType>();
        const listFn = this.inst.list;
        const listMock = Mock.ofType<typeof listFn>();
        listMock.setup(m => m()).returns(() => testEmitter);
        this.inst["list"] = listMock.object;
        const resultPromise = this.inst.info("something");

        testEmitter.emit("end", <ITemplate[]> [ { identity: "ignore"}, toBeFound ]);
        const result = await resultPromise;
        Assert(toBeFound).equals(result);
    }

    @AsyncTest()
    async info_rejectsWithAppropriateErrorObjectIfTemplateNotFound() {
        const testEmitter = new EventEmitter<TemplateSearchEmitterType>();
        const listFn = this.inst.list;
        const listMock = Mock.ofType<typeof listFn>();
        listMock.setup(m => m()).returns(() => testEmitter);
        this.inst["list"] = listMock.object;
        const resultPromise = this.inst.info("something");

        testEmitter.emit("end", <ITemplate[]> [ { identity: "ignore"} ]);
        (await Assert(async () => await resultPromise)
            .throwsAsync())
            .that.has(e => e.message).that
                .contains("something")
                .matches(/was not found/);
        
    }

    @AsyncTest()
    async info_rejectsWithErrorWrapperOnError() {
        const testErr = new Error();
        const listFn = this.inst.list;
        const listMock = Mock.ofType<typeof listFn>();
        listMock.setup(m => m()).throws(testErr)
        this.inst["list"] = listMock.object;
        const resultPromise = this.inst.info("something");

        (await Assert(async () => await resultPromise)
            .throwsAsync())
            .that.has(e => e.message).that
                .contains("something")
                .matches(/Unknown error searching/);
    }

    @AsyncTest()
    async info_rejectsWithErrorOnSearchError() {
        const testEmitter = new EventEmitter<TemplateSearchEmitterType>();
        const testErr = new TemplateManagerError(new Error(), "file");
        const listFn = this.inst.list;
        const listMock = Mock.ofType<typeof listFn>();
        listMock.setup(m => m()).returns(() => testEmitter);
        this.inst["list"] = listMock.object;
        const resultPromise = this.inst.info("something");

        testEmitter.emit("error", testErr);
        (await Assert(async () => await resultPromise)
            .throwsAsync())
            .that.has(e => e.message)
            .that
                .contains("something")
                .matches(/Error searching for templateId/);
        
    }
}