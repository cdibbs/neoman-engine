import { CommandErrorType } from "./command-error-type";

export class CommandResult {
    public constructor(
        public Message?: string,
        public ErrorType: CommandErrorType = CommandErrorType.None,
        public Error: Error = null)
    {
    }

    public get IsError(): boolean { return this.ErrorType !== CommandErrorType.None; }

}