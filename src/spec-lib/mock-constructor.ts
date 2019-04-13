export class MockConstructor {
    public cargs: any[];
    constructor(...args: any[]) {
        this.cargs = args;
    }
}