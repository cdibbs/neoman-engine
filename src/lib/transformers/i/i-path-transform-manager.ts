import { PathTransforms } from "../../user-extensibility/template";
import { ITemplate } from "../../i";

export interface IPathTransformManager {
    configure(tmpl: ITemplate, inputs: { [key: string]: any }): void;
    applyTransforms(path: string, tDefs: PathTransforms): Promise<string>;
}