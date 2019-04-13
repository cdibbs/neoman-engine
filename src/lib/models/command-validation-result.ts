import { EOL } from 'os';
import { CommandErrorType } from "./command-error-type";
import { CommandResult } from "./command-result";

export class CommandValidationResult extends CommandResult {
    private _message: string;
    public get Message(): string { return this._message || this.Messages.join(EOL); }
    public set Message(value: string) { this._message = value; }
    public Messages: string[] = [];

    public toString(): string {
        return `${this.Message}${EOL}${this.Error}`;
    }
}