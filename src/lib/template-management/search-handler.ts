import { TemplateSearchEmitterType, EventEmitter } from "../emitters";
import { ITemplate, IPath, IFileSystem, IUserMessager } from "../i";
import { TemplateManagerError } from "./template-manager-error";
import { ITemplatePreprocessor } from "./i-template-preprocessor";
import { ISearchHandler } from "./i-search-handler";
import { ITemplatePathUtil } from "./i-template-path-util";

export class SearchHandler implements ISearchHandler {
    protected completedSearches: { [key: string]: boolean };

    constructor(
        protected msg: IUserMessager,
        protected pathUtil: ITemplatePathUtil,
        protected fs: IFileSystem,
        protected tmplPrep: ITemplatePreprocessor,
        protected templatesRef: ITemplate[],
        protected locations: { [key: string]: string }
    ) {
        this.completedSearches = {};
    }

    public endList(emitter: EventEmitter<TemplateSearchEmitterType>, path: string): void {        
        this.completedSearches[path] = true;
        if (Object.keys(this.locations).every(k => this.completedSearches[k])) {
            emitter.emit('end', this.templatesRef);
        }
    }

    public templateMatch(emitter: EventEmitter<TemplateSearchEmitterType>, tmplDir: string, file: string): void {
        let fullPath;
        try {
            fullPath = this.pathUtil.determineTemplateFileFullPath(tmplDir, file);
            const rawTmpl = JSON.parse(this.fs.readFileSync(fullPath, 'utf8'));
            const tmpl = this.tmplPrep.preprocess(rawTmpl);
            const tmplAbsRoot = this.pathUtil.determineTemplateRootPath(fullPath);
            tmpl.__tmplPath = this.pathUtil.determineConfiguredRoot(tmplAbsRoot, tmpl.root);
            tmpl.__tmplConfigPath = tmplAbsRoot;
            tmpl.__tmplRepo = tmplDir;
            this.templatesRef.push(tmpl);
            emitter.emit("match", tmpl);
        } catch (ex) {
            emitter.emit("error", new TemplateManagerError(ex, fullPath));
        }
    }
}