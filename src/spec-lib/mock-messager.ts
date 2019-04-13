import * as sinon from 'sinon';

import * as path from 'path';
import { UserMessager } from '../lib/user-messager';
import * as i from '../lib/i';
import * as i18n from 'i18n';

export let mockMessagerFactory = ( { echo = false }: { echo: boolean } = { echo: false }) => {
    // Set it up so we collect/return english strings.
    i18n.configure({
        locales: ['en_US'],
        defaultLocale: 'en_US',
        syncFiles: true,
        directory: path.join(__dirname, '..', '..', "locales")
    });

    let log = (...args: any[]) => {
        if (echo) {
            console.log.apply(console, args);
        }
    }
    let err = (...args: any[]) => {
        if (echo) {
            console.error.apply(console, args);
        }
    }
    let warn = (...args: any[]) => {
        if (echo) {
            console.warn.apply(console, args);
        }
    }

    let m = new UserMessager(i18n.__mf);
    m["console"] = <any>{
        log: sinon.spy(log),
        error: sinon.spy(err),
        warn: sinon.spy(warn)
    };
    return m;
}