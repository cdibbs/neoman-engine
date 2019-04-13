export class InfoError {
    constructor(
        public type: 404 | 500, // :-)
        public message: string,
        public err?: Error
        ){}
}