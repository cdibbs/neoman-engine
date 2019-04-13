import { CommandValidationResult } from "../models";

export interface IErrorReporter {
    reportError(err: Error | CommandValidationResult | string): void;
}