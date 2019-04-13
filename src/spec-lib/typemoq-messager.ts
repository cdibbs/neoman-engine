import { IMock, It, Mock } from "typemoq";

import * as path from 'path';
import { UserMessager } from '../lib/user-messager';
import * as i from '../lib/i';
import * as i18n from 'i18n';

/**
 * Builds a partially-mocked messager that serves the double purpose of building our
 * i18n string library when we run tests, too.
 * 
 * @param echo turn on console echo (mainly for debugging tests). Default: false.
 */
export let mockMessagerFactory = function (
    {echo = false, out = null}: { echo?: boolean, out?: { mockConsole: IMock<Console> } } = { echo: false, out: null }
) {
    // Set it up so we collect/return english strings.
    i18n.configure({
        locales: ['en_US'],
        defaultLocale: 'en_US',
        syncFiles: true,
        directory: path.join(__dirname, '..', '..', "locales")
    });

    // Create a mock console to back the messager.
    function createCallback(fn: (...args: any[]) => void) {
        if (echo) return fn;
        return (...args: any[]) => {};
    }

    let mockConsole: IMock<Console> = Mock.ofType<Console>();
    mockConsole
        .setup(m => m.log(It.isAnyString()))
        .callback(createCallback(console.log));
    mockConsole
        .setup(m => m.warn(It.isAnyString()))
        .callback(createCallback(console.warn));
    mockConsole
        .setup(m => m.error(It.isAnyString()))
        .callback(createCallback(console.log));

    let m = new UserMessager(i18n.__mf);
    m["console"] = mockConsole.object;
    if (out) {
        out.mockConsole = mockConsole;
    }

    return m;
}