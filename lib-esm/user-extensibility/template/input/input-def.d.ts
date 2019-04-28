import { IComplexInputDef } from "./i-complex-input-def";
import { IDerivedInputDef } from "./i-derived-input-def";
import { IArgvOptions } from "./i-argv-options";
export declare type InputDef = string | IComplexInputDef<IArgvOptions> | IDerivedInputDef;
