import { IUserMessager, Levels, Ii18nFunction } from './i';
export declare class UserMessager implements IUserMessager {
    private __mf;
    private mfDict;
    private usei18n;
    private console;
    constructor(__mf: Ii18nFunction, mfDict?: any, usei18n?: boolean);
    info(message: any, indent?: number): IUserMessager;
    debug(message: any, indent?: number): IUserMessager;
    warn(message: any, indent?: number): IUserMessager;
    error(message: any, indent?: number): IUserMessager;
    mf(message: any, mfDict?: any): string;
    write(message: string, indent?: number, level?: Levels): IUserMessager;
    /**
     * Enable i18n + MessageFormat dictionary for subsequent method calls.
     * Example: this.msg.i18n(myKeyVals).debug("a {key} message")
     * @param mfDict Dictionary to use for i18n
     */
    i18n(mfDict?: any): IUserMessager;
}
