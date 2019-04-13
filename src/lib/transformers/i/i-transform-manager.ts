import { ITemplate } from "../../i";
import { Transforms } from "../../user-extensibility/template";

export interface ITransformManager {
    configure(tmpl: ITemplate, inputs: { [key: string]: any }): void;
    applyTransforms(path: string, content: string, replaceDef: Transforms): Promise<string>;
}