import { IPluginReference } from "./common";

export interface IConfiguration extends IPluginReference {
    files: string[];
    ignore: string[];
}