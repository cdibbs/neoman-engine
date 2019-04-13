export interface IKernel {
    Go(argv?: string[]): Promise<{}>;
}