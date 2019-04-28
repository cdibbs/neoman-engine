import { RunOptions, Discovery } from "../models";
import { ITemplate } from "../i";
import { Observable } from "rxjs";
import { Transform } from "../models/transform";
export interface ITreeTransformer {
    register(source: Observable<Discovery>, tmpl: ITemplate, options: RunOptions, inputs: {
        [key: string]: any;
    }): Observable<Transform>;
}
