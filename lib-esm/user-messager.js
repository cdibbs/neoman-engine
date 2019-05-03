var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var UserMessager_1;
import { inject, injectable } from 'inversify';
import { LEVELS } from './i';
import TYPES from './di/types';
let UserMessager = UserMessager_1 = class UserMessager {
    constructor(__mf, mfDict = null, usei18n = false) {
        this.__mf = __mf;
        this.mfDict = mfDict;
        this.usei18n = usei18n;
        this.console = console;
    }
    info(message, indent) {
        this.write(message, indent, LEVELS.Info);
        return this;
    }
    debug(message, indent) {
        this.write(message, indent, LEVELS.Debug);
        return this;
    }
    warn(message, indent) {
        this.write(message, indent, LEVELS.Warn);
        return this;
    }
    error(message, indent) {
        this.write(message, indent, LEVELS.Error);
        return this;
    }
    mf(message, mfDict) {
        let newDict = {};
        Object.assign(newDict, this.mfDict || {}, mfDict);
        return this.__mf(message, newDict);
    }
    write(message, indent = 0, level = LEVELS.Debug) {
        let space = "  ".repeat(indent);
        let msg = `${space}${message}`;
        if (this.usei18n) {
            msg = this.__mf(msg, this.mfDict);
        }
        switch (level) {
            case LEVELS.Debug:
                this.console.log(msg);
                break;
            case LEVELS.Info:
                this.console.log(msg);
                break;
            case LEVELS.Warn:
                this.console.warn(msg);
                break;
            case LEVELS.Error:
                this.console.error(msg);
                break;
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
    i18n(mfDict) {
        let newDict = {};
        Object.assign(newDict, this.mfDict || {}, mfDict);
        let um = new UserMessager_1(this.__mf, newDict, true);
        um.console = this.console;
        return um;
    }
};
UserMessager = UserMessager_1 = __decorate([
    injectable(),
    __param(0, inject(TYPES.i18n)),
    __metadata("design:paramtypes", [Function, Object, Boolean])
], UserMessager);
export { UserMessager };
//# sourceMappingURL=user-messager.js.map