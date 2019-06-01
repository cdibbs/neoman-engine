import { TemplateContentFile } from "../models";
import { IFilePatterns } from "../i";
import { injectable, inject } from "inversify";
import { Observable } from "rxjs";
import { filter } from 'rxjs/operators';
import TYPES from "../di/types";
import { curry } from "../util";


@injectable()
export class TemplateDiscoverer 
{
    public constructor(
        @inject(TYPES.FilePatterns) private matcher: IFilePatterns
    ) {
    }

    find(
        source: Observable<TemplateContentFile>    ): Observable<TemplateContentFile> {
        return source.pipe(filter(curry.bindOnly(this.includeOnlyTemplates, this)));
    }

    private includeOnlyTemplates(
        file: TemplateContentFile
    ): boolean {
        return this.matcher.isMatch(file.absolutePath, "**/.neoman.config/template.json");
    }
}