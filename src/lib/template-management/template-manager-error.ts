export class TemplateManagerError {
    constructor(
        public error: Error,
        public file: string,
        public message: string = error.message)
    {
    }
}