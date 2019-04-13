export interface IHandlerService {
    resolveAndLoad(tmplConfigRootPath: string, handler: string): Promise<Function>;
}