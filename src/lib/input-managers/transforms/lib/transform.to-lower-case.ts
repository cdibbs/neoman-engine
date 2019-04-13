export class ToLowerCaseTransform {
    readonly key: string = "toLowerCase";

    transform(input: string): string {
        return input ? input.toLowerCase() : input;
    }
}