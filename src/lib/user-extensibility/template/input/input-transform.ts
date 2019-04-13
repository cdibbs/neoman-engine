import { IHandlerReference } from "../common";

export interface IInputTransform {
    /**
     * A regular expression string of the form "/[an expression]/".
     */
    match: string,

    /**
     * A replacement string potentially containing substitution keys, e.g.,
     * $1, $2, $3, etc.
     */
    replace: string,

    /**
     * A dictionary of Javascript RegExp substitution keys, e.g., $1, $2, etc.
     * The value for each key can be either a string referencing a library call
     * like "toLowerCase", or an object referencing a relative handler path.
     */
    modify: { [key: string]: string | IHandlerReference };
}

export type InputTransform = string | IInputTransform;