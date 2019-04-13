import { Test, TestFixture, AsyncTest, TestCase, TestCases, AsyncSetup, AsyncTeardown, Teardown, Setup } from 'alsatian';
import { Mock, IMock, It, Times } from 'typemoq';
import * as c from 'commandpost';

import { Levels, LEVELS, Ii18nFunction, IUserMessager } from './i';
import { UserMessager } from './user-messager';
import { Assert } from 'alsatian-fluent-assertions';

@TestFixture("User Messager Tests")
export class UserMessagerTests {
    i18nMock: IMock<Ii18nFunction>;
    writeMock: IMock<(s: string, n: number, l: Levels) => IUserMessager>;
    msgr: UserMessager;
    consoleMock: IMock<Console>;

    @Setup
    public beforeEach() {
        this.i18nMock = Mock.ofType<Ii18nFunction>();
        this.writeMock = Mock.ofType<(s: string, n: number, l: Levels) => IUserMessager>();
        this.consoleMock = Mock.ofType<Console>();

        this.msgr = new UserMessager(this.i18nMock.object, null, false);
        this.msgr["console"] = this.consoleMock.object;
    }

    @TestCase("info", LEVELS.Info)
    @TestCase("debug", LEVELS.Debug)
    @TestCase("warn", LEVELS.Warn)
    @TestCase("error", LEVELS.Error)
    @Test("helpers - called with correct levels.")
    public level_writesWithCorrectLevels(method: string, level: Levels) {
        this.msgr["write"] = this.writeMock.object;
        this.msgr[method]("something");
        this.writeMock.verify(w => w("something", undefined, level), Times.once());
    }

    @TestCase(LEVELS.Info, "log")
    @TestCase(LEVELS.Debug, "log")
    @TestCase(LEVELS.Warn, "warn")
    @TestCase(LEVELS.Error, "error")
    @Test("write - uses correct console method.")
    public write_usesCorrectMethod(level: Levels, method: string) {
        this.msgr.write("something", 0, level);
        this.consoleMock.verify(c => c[method]("something"), Times.once());
    }
    
    @Test("write - returns self.")
    public write_returnsSelf() {
        let result = this.msgr.write("something");
        Assert(result)
            .isDefined()
            .equals(this.msgr);
    }

    @TestCase(false, 0)
    @TestCase(true, 1)
    @Test("write - formats message with i18n when use i18n.")
    public write_formatsMessageWithi18n_whenUsei18n(usei18n: boolean, _mfCalls: number) {
        this.msgr = new UserMessager(this.i18nMock.object, null, usei18n);
        this.msgr["console"] = this.consoleMock.object;
        this.msgr.write("something");
        this.i18nMock.verify(i => i("something", It.isAny()), Times.exactly(_mfCalls));
    }

    @Test("write - throws on bad log level.")
    public write_throwsOnBadLogLevel() {
        let err = "formatted error message";
        this.i18nMock.setup(i => i(It.isAnyString(), It.isAny())).returns(() => err);
        Assert(() => this.msgr.write("something", 0, <Levels>"bogus"))
            .throws(Error)
            .that.has({ message: err })
    }

    @Test("i18n - returns new instance of self with i18n enabled.")
    public i18n_returnsSelfWithi18nEnabled() {
        let mybag = { "what": "is this" };
        let result = this.msgr.i18n(mybag);
        let a = Assert(result)
            .isDefined()
            .is(UserMessager);
        a.hasProperty(<any>"mfDict").that.deepStrictlyEquals(mybag);
        a.hasProperty(<any>"usei18n").that.isTruthy();
    }

    @TestCase(null)
    @TestCase(undefined)
    @TestCase({'msg': 'something'})
    @Test("mf - should pass correct state to i18n __mf library call.")
    public mf_passesCorrectState(bag: any) {
        let mybag = { "new": "state" };
        let imsgr = this.msgr.i18n(mybag);
        imsgr.mf("some thing");
        this.i18nMock.verify(i => i("some thing", mybag), Times.once());
    }

    @TestCase(null, {one: 'two'})
    @TestCase(undefined, {one: 'two'})
    @TestCase({'msg': 'something'}, { 'msg': 'something', one: 'two'})
    @Test("mf - should pass correct state to i18n __mf library call.")
    public mf_passesOptionalBagArgument(bag: any, expectedBag: any) {
        let mybag = { one: 'two' };
        let imsgr = this.msgr.i18n(mybag);
        imsgr.mf("some thing", bag);
        this.i18nMock.verify(i => i(
                'some thing',
                It.is(b => { Assert(b).deeplyEquals(expectedBag); return true; })),
            Times.once());
    }

}