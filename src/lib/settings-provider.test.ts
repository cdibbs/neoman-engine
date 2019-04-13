import { Setup, Test, TestCase, TestFixture } from 'alsatian';
import { IMock, Mock, It, Times } from 'typemoq';
import { SettingsProvider } from './di/entities';
import { IFileSystem, IPath, LEVELS, Levels } from './i';
import { Assert } from 'alsatian-fluent-assertions';
import { IMapperService } from 'simple-mapper';

@TestFixture("Settings Provider Tests")
export class SettingsProviderTests {
    procMock: IMock<NodeJS.Process>;
    mapperMock: IMock<IMapperService>;
    sp: SettingsProvider<BogusSettings>;
    fsMock: IMock<IFileSystem>;
    pathMock: IMock<IPath>;
    homeStr: string = "/tmp/home";

    @Setup
    public beforeEach() {
        this.procMock = Mock.ofType<NodeJS.Process>();
        this.procMock
            .setup(x => x.env)
            .returns(() => <any>{ USERPROFILE: this.homeStr });
        this.fsMock = Mock.ofType<IFileSystem>();
        this.mapperMock = Mock.ofType<IMapperService>();
        this.pathMock = Mock.ofType<IPath>();
        this.pathMock
            .setup(x => x.join(It.isAny(), It.isAny()))
            .returns(x => "bogus");
        this.sp = new SettingsProvider(BogusSettings, this.procMock.object, this.mapperMock.object, this.fsMock.object, this.pathMock.object);
    }

    @TestCase({ key: 123 }, 123)
    @TestCase({}, undefined)
    @Test("get - returns setting.")
    public get_returnsSettings(settings: any, expected: any) {
        this.sp["readSettings"] = () => settings;
        Assert(this.sp.get("key")).equals(expected);
    }

    @Test("set - writes setting.")
    public set_writesSettings() {
        this.sp["readSettings"] = () => <any>{};
        this.sp.set("key", 123);

        this.pathMock.verify(x => x.join(this.homeStr, this.sp["filename"]), Times.once());
        this.fsMock.verify(x => x.writeFileSync("bogus", It.is(s => (JSON.parse(<string>s)).key === 123)), Times.once());
    }

    @Test("readSettings - returns mapped.")
    public readSettings_returnsMapped() {
        const read = <any>{ key: 123 };
        const expected = <any>{ iWasMapped: true };
        this.mapperMock
            .setup(x => x.map(BogusSettings, read))
            .returns(() => expected);
        this.sp["readFileJSON"] = () => read;
        const result = this.sp.readSettings();

        Assert(result).deeplyEquals(expected);
    }

    @Test("readFileJSON - no errors, returns options")
    public readFileJSON_noErrors_returnsOptions() {

    }

    @TestCase("ENOENT", 1)
    @TestCase("BOGUS", 0)
    @Test("readFileJSON - read error, ensures file exists with defaults, or throws.")
    public readFileJSON_readError_returnsOptions(code: string, writeCount: number) {
        const filePath = "bogus";
        const fileErr = new Error();
        fileErr["code"] = code;
        this.fsMock
            .setup(x => x.readFileSync(filePath, "ascii"))
            .throws(fileErr);

        const testFn = () => this.sp.readFileJSON(filePath);

        Assert(testFn)
            .maybe(!writeCount).throws().that
            .maybe(!writeCount).equals(fileErr);
        this.fsMock
            .verify(x => x.writeFileSync(filePath, It.isAny()), Times.exactly(writeCount));
    }

    @Test("readFileJSON - parse error, adds filepath and rethrows.")
    public readFileJSON_parseError_addsFilePathRethrows() {
        const filePath = "bogus";
        const fileErr = new Error();
        this.fsMock
            .setup(x => x.readFileSync(filePath, "ascii"))
            .returns(() => "{'some':'json'}");

        const testFn = () => this.sp.readFileJSON(filePath);

        Assert(testFn).throws<Error & { filepath: string }>()
            .that.has(e => e.filepath)
                .that.equals(filePath);
        this.fsMock
            .verify(x => x.writeFileSync(It.isAny(), It.isAny()), Times.never());
    }
}

export class BogusSettings {

}