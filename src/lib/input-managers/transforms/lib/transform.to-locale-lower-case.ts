export class ToLocaleLowerCaseTransform {
    readonly key: string = "toLocaleLowerCase";

    transform(input: string): string {
        return input ? input.toLocaleLowerCase() : input;
    }
}