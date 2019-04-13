import { ISimpleTransformer } from "./lib";

export interface IBuiltinTransforms {
    get(key: string): ISimpleTransformer;
}