import { InputDef } from "../../user-extensibility/";

export interface IDefaultsAnswerer {
    getDefault(def: InputDef): any;
}