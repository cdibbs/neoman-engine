import { TemplateContentFile } from "../models";
import { IFilePatterns } from "../i";
import { Observable } from "rxjs";
export declare class TemplateDiscoverer {
    private matcher;
    constructor(matcher: IFilePatterns);
    find(source: Observable<TemplateContentFile>): Observable<TemplateContentFile>;
    private includeOnlyTemplates;
}
