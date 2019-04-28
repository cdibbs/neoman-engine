import { RunOptions, TemplateContentFile } from "../models";
import { Observable } from "rxjs";

export interface ITemplateDiscoverer {
    find(
        source: Observable<TemplateContentFile>,
        options: RunOptions
    ): Observable<TemplateContentFile>;
}