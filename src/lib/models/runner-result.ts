import { CommandResult } from "./command-result";
import { CommandErrorType } from "./command-error-type";

export class RunnerResult extends CommandResult {
    public constructor(
        message?: string,
        errorType: CommandErrorType = CommandErrorType.None,
        error: Error = null)
    {
        super(message, errorType, error);
        if (! message)
        {
            this.Message = `${this.totalFiles} files copied, ${this.changed} were transformed.`;
        }
    }

    totalFiles: number = 0;
    excluded: number = 0;
    processed: number = 0;
    changed: number = 0;
    totalChanges: number = 0;
}