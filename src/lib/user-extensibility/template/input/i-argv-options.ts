export type ArgvArgType = "positional" | "absolutePositional" | "flag" | "paramFlag";

export interface IArgvOptions {
    /**
     * Can be:
     *  "positional" - a zero-based index into unmatched arguments;
     *  "absolutePositional" - an index into all arguments, regardless of prior matching;
     *  "flag" - uses definition key as a boolean flag ("--key");
     *  "paramFlag" - uses definition key to identify a value ("--key value").
     */
    argType?: ArgvArgType
    
    /**
     * Argument alias to use when parsing the commandline arguments.
     * Defaults to the dictionary key of this definition, with non-alphanumeric
     * characters replaced with underscores. It is strongly recommended that
     * you use this alias when the definition's key has a lot of
     * non-alphanumeric characters.
     */
    argAlias?: string;

    /**
     * The position of a "positional" or "absolutePositional" argType.
     */
    position?: number;
}