import { Ii18nFunction } from './i-i18n-function';
import { UnionKeyToValue } from '../union-key-to-value';

export interface IConsole {
    log(message?: any, ...args: any[]): void;
    debug(message?: any, ...args: any[]): void;
    warn(message?: any, ...args: any[]): void;
    error(message?: any, ...args: any[]): void;
}

export type Levels = "Debug" | "Info" | "Warn" | "Error";
export const LEVELS: UnionKeyToValue<Levels> = {
    Debug: "Debug",
    Info: "Info",
    Warn: "Warn",
    Error: "Error"
}

export interface IUserMessager {
    mf(message: any, mfDict?: any): string;

    debug(message: any, indent?: number): IUserMessager
    info(message: any, indent?: number): IUserMessager
    warn(message: any, indent?: number): IUserMessager
    error(message: any, indent?: number): IUserMessager;
    write(message: string, indent?: number, level?: Levels): IUserMessager;
    /**
     * Enable i18n + MessageFormat dictionary for subsequent method calls.
     * Example: this.msg.i18n(myKeyVals).debug("a {key} message")
     * @param mfDict Dictionary to use for i18n
     */
    i18n(mfDict?: any): IUserMessager
}