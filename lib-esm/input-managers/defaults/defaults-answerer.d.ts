import { IDefaultsAnswerer } from "./i-defaults-answerer";
import { InputDef } from "../../user-extensibility";
export declare class DefaultsAnswerer implements IDefaultsAnswerer {
    protected autoInc: number;
    getDefault(def: InputDef): any;
}
