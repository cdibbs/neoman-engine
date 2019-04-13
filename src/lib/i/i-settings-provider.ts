export interface ISettingsProvider {
    get(key: string): any;
    set(key: string, value: any): void;
}