import { inject, injectable } from "inversify";
import TYPES from "../di/types";
import { IUserMessager, IFileSystem, IPath, ITemplate } from "../i";
import { ITemplatePreprocessor } from ".";
import { SearchHandler } from "./search-handler";
import { ISearchHandlerFactory } from "./i-search-handler-factory";
import { ISearchHandler } from "./i-search-handler";
import { ITemplatePathUtil } from "./i-template-path-util";

@injectable()
export class SearchHandlerFactory implements ISearchHandlerFactory {
    protected hndClass = SearchHandler;
    constructor(
        @inject(TYPES.UserMessager) protected msg: IUserMessager,
        @inject(TYPES.FS) private fs: IFileSystem,
        @inject(TYPES.TemplatePathUtil) private pathUtil: ITemplatePathUtil,
        @inject(TYPES.TemplatePreprocessor) private tmplPrep: ITemplatePreprocessor
    ) {

    }

    build(locations: { [key: string]: string }, templatesRef: ITemplate[]): ISearchHandler {
        return new this.hndClass(this.msg, this.pathUtil, this.fs, this.tmplPrep, templatesRef, locations);
    }
}