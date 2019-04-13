import { inject, injectable } from 'inversify';
import TYPES from '../di/types';
import { EventEmitter, TemplateSearchEmitterType } from '../emitters';
import { IReadOnlyEventEmitter } from '../emitters/i';
import { ISettingsProvider, ITemplate, IUserMessager } from '../i';
import KEYS from '../settings-keys';
import { curry } from '../util/curry';
import { IGlobFactory } from '../util/i-glob-factory';
import { ISearchHandlerFactory } from './i-search-handler-factory';
import { ITemplateManager } from './i-template-manager';
import { TemplateManagerError } from './template-manager-error';
import { ISearchHandler } from './i-search-handler';
import { InfoError } from './info-error';

@injectable()
export class TemplateManager implements ITemplateManager {
    protected searchLocations: { [key: string]: string};
    protected tmplDir: string;

    constructor(
        @inject(TYPES.SettingsProvider) protected settings: ISettingsProvider,
        @inject(TYPES.UserMessager) protected msg: IUserMessager,
        @inject(TYPES.Process) private process: NodeJS.Process,
        @inject(TYPES.GlobFactory) private globFactory: IGlobFactory,
        @inject(TYPES.SearchHandlerFactory) private searchHandlerFactory: ISearchHandlerFactory
    ) {
        this.tmplDir = this.settings.get(KEYS.tempDirKey);
        this.searchLocations = {
            "*/.neoman.config/template.json": this.tmplDir, // global
            ".neoman/**/.neoman.config/template.json": this.process.cwd() // project/local
        };
    }


    // Maps a glob-match emitter to an ITemplate emitter.
    /**
     * Builds an emitter to list templates in the template directory.
     * @param end A function accepting an ITemplate[] array to pre-bind to the returned emitter's "end" event.
     * @param error A function accepting a TemplateManagerError to pre-bind to the returned emitter's "error" event.
     * @param match A function accepting an ITemplate instance to pre-bind to the returned emitter's "match" event.
     */
    list(
        end?: (templates: ITemplate[]) => void,
        error?: (terror: TemplateManagerError) => void,
        match?: (tmpl: ITemplate) => void
    ): IReadOnlyEventEmitter<TemplateSearchEmitterType> {
        const templates: ITemplate[] = [];
        const defaultEmitter = new EventEmitter<TemplateSearchEmitterType>();
        //defaultEmitter.on("match", curry.oneOf2(this.addToTemplateCollection, this, templates));
        this.setupUserInitialEmitters(defaultEmitter, end, error, match);

        // FS Glob callbacks translate to ITemplate emitters. The flow looks like:
        //   fs glob emitters -> glob callbacks (below) -> ITemplate emitters (above) -> user land callbacks.
        // The ITemplate emitters serve to collate the results from different ITemplate
        // locations. They also extend the available emitters to facilitate error handling,
        // and fetching all results at the end.
        const searchHandler = this.searchHandlerFactory.build(this.searchLocations, templates);
        for (const path in this.searchLocations) {
            this.setupSearchGlob(path, this.searchLocations, searchHandler, defaultEmitter, templates);
        }

        return defaultEmitter;
    }

    protected setupSearchGlob(
            path: string,
            locations: { [key: string]: string },
            searchHandler: ISearchHandler,
            defaultEmitter: EventEmitter<TemplateSearchEmitterType>,
            templates: ITemplate[]
    ): void {
        const search = this.globFactory.build(path, { cwd: locations[path] });
        search.on("match", curry.twoOf3(searchHandler.templateMatch, searchHandler, defaultEmitter, locations[path]));
        search.on("end", curry.twoOf3(searchHandler.endList, searchHandler, defaultEmitter, path));
    }

    protected setupUserInitialEmitters(
        defaultEmitter: EventEmitter<TemplateSearchEmitterType>,
        end?: (templates: ITemplate[]) => void,
        error?: (terror: TemplateManagerError) => void,
        match?: (tmpl: ITemplate) => void
    ): void {
        if (match instanceof Function) {
            defaultEmitter.on("match", match);
        }
        
        if (end instanceof Function) {
            defaultEmitter.on("end", end);
        }

        if (error instanceof Function) {
            defaultEmitter.on("error", error);
        }
    }

    /**
     * Get info about the given template, if it exists.
     * @param tmplId Template identifier
     */
    async info(tmplId: string): Promise<ITemplate> {
        return new Promise<ITemplate>((resolve, reject) => {
            try {
                let emitter = this.list();
                emitter.on('end', curry.threeOf4(this.infoFound, this, resolve, reject, tmplId));
                emitter.on('error', curry.twoOf3(this.infoError, this, reject, tmplId));
            } catch (err) {
                const infoError = new InfoError(
                    500,
                    this.msg.mf('Unknown error searching for templateId "{tmplId}".', {tmplId}),
                    err);
                reject(infoError);
            }
        });
    }

    private infoError(reject: (reason?: any) => void, tmplId: string, error: any): void {
        const infoError = new InfoError(
            500,
            this.msg.mf('Error searching for templateId "{tmplId}".', {tmplId}),
            error);
        reject(infoError);
    }

    private infoFound(
        resolve: (value?: ITemplate | PromiseLike<ITemplate>) => void,
        reject: (reason?: any) => void,
        tmplId: string,
        list: ITemplate[]): void
    {
        let result: ITemplate = list.find(tmpl => tmpl.identity === tmplId);
        if (typeof result === "undefined") {
            const infoError = new InfoError(404, this.msg.mf('Template with templateId "{tmplId}" was not found.', {tmplId}));
            reject(infoError);
        } else {
            resolve(result);
        }
    }
}