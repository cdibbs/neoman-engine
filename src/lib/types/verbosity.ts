import { UnionKeyToValue } from '../union-key-to-value';

export type Verbosity = "normal" | "verbose" | "debug";
export const VERBOSITY: UnionKeyToValue<Verbosity> = {
    normal: "normal",
    verbose: "verbose",
    debug: "debug"
}