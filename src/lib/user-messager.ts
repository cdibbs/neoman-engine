import { inject, injectable } from 'inversify';

import { IUserMessager, Levels, LEVELS, Ii18nFunction } from './i';
import TYPES from './di/types';

@injectable()
export class UserMessager implements IUserMessager {
    private console = console;
    constructor(
        @inject(TYPES.i18n) private __mf: Ii18nFunction,
        private mfDict: any = null,
        private usei18n: boolean = false
    ) {}

    info(message: any, indent?: number): IUserMessager {
        this.write(message, indent, LEVELS.Info);
        return this;
    }

    debug(message: any, indent?: number): IUserMessager {
        this.write(message, indent, LEVELS.Debug);
        return this;
    }

    warn(message: any, indent?: number): IUserMessager {
        this.write(message, indent, LEVELS.Warn);
        return this;
    }

    error(message: any, indent?: number): IUserMessager {
        this.write(message, indent, LEVELS.Error);
        return this;
    }

    mf(message: any, mfDict?: any): string {
        let newDict = {};
        Object.assign(newDict, this.mfDict || {}, mfDict);
        return this.__mf(message, newDict);
    }

    write(message: string, indent: number = 0, level: Levels = LEVELS.Debug): IUserMessager {
        let space = "  ".repeat(indent);
        let msg = `${space}${message}`;
        if (this.usei18n) {
            msg = this.__mf(msg, this.mfDict);
        }
        switch (level) {
            case LEVELS.Debug: this.console.log(msg); break;
            case LEVELS.Info: this.console.log(msg); break;
            case LEVELS.Warn: this.console.warn(msg); break;
            case LEVELS.Error: this.console.error(msg); break;
            default:
                throw new Error(this.__mf('Write not implemented for level {level}.', { level: level }));
        }

        return this;
    }

    /**
     * Enable i18n + MessageFormat dictionary for subsequent method calls.
     * Example: this.msg.i18n(myKeyVals).debug("a {key} message")
     * @param mfDict Dictionary to use for i18n
     */
    i18n(mfDict?: any): IUserMessager {
        let newDict = {};
        Object.assign(newDict, this.mfDict || {}, mfDict);
        let um = new UserMessager(this.__mf, newDict, true);
        um.console = this.console;
        return um;
    }
}