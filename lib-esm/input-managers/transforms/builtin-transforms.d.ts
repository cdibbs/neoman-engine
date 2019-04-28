import { ISimpleTransformer } from "./lib";
import { IBuiltinTransforms } from "./i-builtin-transforms";
export declare class BuiltinTransforms implements IBuiltinTransforms {
    protected readonly lookup: {
        [key: string]: ISimpleTransformer;
    };
    constructor(transformers: ISimpleTransformer[]);
    get(key: string): ISimpleTransformer;
}
