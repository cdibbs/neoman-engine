export class ToLocaleUpperCaseTransform {
    readonly key: string = "toLocaleUpperCase";

    transform(input: string): string {
        return input ? input.toLocaleUpperCase() : input;
    }
}