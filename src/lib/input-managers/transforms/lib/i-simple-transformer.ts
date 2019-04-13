export interface ISimpleTransformer {
    readonly key: string;
    transform(input: string): string;
}