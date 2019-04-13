import { injectable, multiInject } from "inversify";
import { ISimpleTransformer } from "./lib";
import TYPES from "../../di/types";
import { IBuiltinTransforms } from "./i-builtin-transforms";

@injectable()
export class BuiltinTransforms implements IBuiltinTransforms {
    protected readonly lookup: { [key: string]: ISimpleTransformer };
    constructor(
        @multiInject(TYPES.SimpleTransformer) transformers: ISimpleTransformer[]
    ) {
        this.lookup = transformers.reduce((dict, t) => dict[t.key] = t, {});
    }

    get(key: string) {
        return this.lookup[key];
    }
}