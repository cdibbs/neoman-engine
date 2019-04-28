"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var i_1 = require("./i");
var types_1 = require("./di/types");
var UserMessager = /** @class */ (function () {
    function UserMessager(__mf, mfDict, usei18n) {
        if (mfDict === void 0) { mfDict = null; }
        if (usei18n === void 0) { usei18n = false; }
        this.__mf = __mf;
        this.mfDict = mfDict;
        this.usei18n = usei18n;
        this.console = console;
    }
    UserMessager_1 = UserMessager;
    UserMessager.prototype.info = function (message, indent) {
        this.write(message, indent, i_1.LEVELS.Info);
        return this;
    };
    UserMessager.prototype.debug = function (message, indent) {
        this.write(message, indent, i_1.LEVELS.Debug);
        return this;
    };
    UserMessager.prototype.warn = function (message, indent) {
        this.write(message, indent, i_1.LEVELS.Warn);
        return this;
    };
    UserMessager.prototype.error = function (message, indent) {
        this.write(message, indent, i_1.LEVELS.Error);
        return this;
    };
    UserMessager.prototype.mf = function (message, mfDict) {
        var newDict = {};
        Object.assign(newDict, this.mfDict || {}, mfDict);
        return this.__mf(message, newDict);
    };
    UserMessager.prototype.write = function (message, indent, level) {
        if (indent === void 0) { indent = 0; }
        if (level === void 0) { level = i_1.LEVELS.Debug; }
        var space = "  ".repeat(indent);
        var msg = "" + space + message;
        if (this.usei18n) {
            msg = this.__mf(msg, this.mfDict);
        }
        switch (level) {
            case i_1.LEVELS.Debug:
                this.console.log(msg);
                break;
            case i_1.LEVELS.Info:
                this.console.log(msg);
                break;
            case i_1.LEVELS.Warn:
                this.console.warn(msg);
                break;
            case i_1.LEVELS.Error:
                this.console.error(msg);
                break;
            default:
                throw new Error(this.__mf('Write not implemented for level {level}.', { level: level }));
        }
        return this;
    };
    /**
     * Enable i18n + MessageFormat dictionary for subsequent method calls.
     * Example: this.msg.i18n(myKeyVals).debug("a {key} message")
     * @param mfDict Dictionary to use for i18n
     */
    UserMessager.prototype.i18n = function (mfDict) {
        var newDict = {};
        Object.assign(newDict, this.mfDict || {}, mfDict);
        var um = new UserMessager_1(this.__mf, newDict, true);
        um.console = this.console;
        return um;
    };
    var UserMessager_1;
    UserMessager = UserMessager_1 = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(types_1.default.i18n)),
        __metadata("design:paramtypes", [Function, Object, Boolean])
    ], UserMessager);
    return UserMessager;
}());
exports.UserMessager = UserMessager;
//# sourceMappingURL=user-messager.js.map