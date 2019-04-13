import { IPath, IFileSystem, IUserMessager } from "../i";
import { ITemplatePathUtil } from "./i-template-path-util";
import { injectable, inject } from "inversify";
import TYPES from "../di/types";

@injectable()
export class TemplatePathUtil implements ITemplatePathUtil {
    constructor(
        @inject(TYPES.UserMessager) protected msg: IUserMessager,
        @inject(TYPES.Path) protected path: IPath,
        @inject(TYPES.FS) protected fs: IFileSystem,
    ) {

    }

    /**
     * Given a template.json in a template collection, determine its full path.
     * @param rootDir The root of a template collection.
     * @param file A file relative to that root.
     */
    determineTemplateFileFullPath(rootDir: string, file: string): string {
        return this.path.join(rootDir, file);
    }

    /**
     * The absolute root of the template (of both the .neoman.config/ and any content folder(s)).
     * @param jsonFullPath The full path to a given template.json.
     */
    determineTemplateRootPath(jsonFullPath: string): string {
        return this.path.join(this.path.dirname(jsonFullPath), '..');
    }

    /**
     * Uses $.root from template.json to calculate the desired template root relative to configRoot.
     * @param templateRoot The parent directory of a given .neoman.config/.
     * @param rawConfiguredRoot The user-provided 'root' element from .neoman.config/template.json.
     */
    determineConfiguredRoot(templateRoot: string, rawRelConfigRoot: any): string {
        let root = templateRoot;
        if (typeof rawRelConfigRoot === "string") {
            root = this.path.join(root, rawRelConfigRoot);
        } else if (typeof rawRelConfigRoot !== "undefined") {
            throw new Error(this.msg.mf("Element 'root' (JsonPath: $.root) within template.json must be a string."));
        }

        if (! this.fs.statSync(root).isDirectory) {
            throw new Error(this.msg.mf("Template root is not a directory: {root}.", {root}));
        }

        return root;        
    }
}