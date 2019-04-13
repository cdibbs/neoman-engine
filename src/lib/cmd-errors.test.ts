import { Test, TestFixture, AsyncTest, TestCase, TestCases, AsyncSetup, AsyncTeardown, Teardown, Setup } from 'alsatian';
import { Assert } from 'alsatian-fluent-assertions';
import * as c from 'commandpost';

import { cmdErrors } from './cmd-errors';

@TestFixture("CmdErrors Dictionary Tests")
export class CmdErrorsTests {

    @TestCases(allLibraryErrorReasons())
    @Test("should not throw for any commandpost errors.")
    public noErrorsEver(err: c.ErrorReason) {
        Assert(cmdErrors).hasProperty(err);
        Assert(() => cmdErrors[err](null)).not.throws();
        Assert(() => cmdErrors[err](<any>{})).not.throws();
        Assert(() => cmdErrors[err](<any>{ params: null })).not.throws();
        Assert(() => cmdErrors[err](<any>{ params: { parts: null } })).not.throws();
        Assert(() => cmdErrors[err](<any>{ params: { parts: [ "whoa" ] } })).not.throws();
    }
}

function allLibraryErrorReasons(): c.ErrorReason[][] {
    return Object
        .keys(c.ErrorReason)
        .map(er => [c.ErrorReason[er]]);
}