import { ISearchHandler } from "./i-search-handler";
import { ITemplate } from "../i";

export interface ISearchHandlerFactory {
    build(locations: { [key: string]: string }, templatesRef: ITemplate[]): ISearchHandler;
}