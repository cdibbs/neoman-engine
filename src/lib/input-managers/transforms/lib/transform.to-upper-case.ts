export class ToUpperCaseTransform {
    readonly key: string = "toUpperCase";

    transform(input: string): string {
        return input ? input.toUpperCase() : input;
    }
}