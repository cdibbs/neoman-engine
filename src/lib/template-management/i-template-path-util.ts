export interface ITemplatePathUtil {
    /**
     * Given a template.json in a template collection, determine its full path.
     * @param rootDir The root of a template collection.
     * @param file A file relative to that root.
     */
    determineTemplateFileFullPath(rootDir: string, file: string): string;

    /**
     * The absolute root of the template (of both the .neoman.config/ and any content folder(s)).
     * @param jsonFullPath The full path to a given template.json.
     */
    determineTemplateRootPath(jsonFullPath: string): string;

    /**
     * Uses $.root from template.json to calculate the desired template root relative to configRoot.
     * @param templateRoot The parent directory of a given .neoman.config/.
     * @param rawConfiguredRoot The user-provided 'root' element from .neoman.config/template.json.
     */
    determineConfiguredRoot(templateRoot: string, rawRelConfigRoot: any): string;
}