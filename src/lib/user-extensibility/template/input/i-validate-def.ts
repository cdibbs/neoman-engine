export interface IValidationDef {
    /**
     * A regular expression used to validate the input. If the expression
     * doesn't match, the input will be rejected in accordance with the
     * input plugin.
     */
    match: string;

    /**
     * The validation message to show. E.g., "Must be a valid class name."
     */
    message: string;
}