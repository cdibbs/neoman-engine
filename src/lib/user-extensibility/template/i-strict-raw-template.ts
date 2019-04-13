import { Transforms } from "./transforms";
import { PathTransforms } from "./path-transforms";
import { IConfigurations } from "./i-configurations";
import { ITemplateComments } from "./i-template-comments";
import { IInputConfig } from "./input";

/**
 * The strict template.json format which excludes the possibility
 * of user-defined keys and comments.
 */
export interface IStrictRawTemplate extends ITemplateComments {
    /**
     * We only require two fields: name and identity. This is enough to identify
     * and run the template. If you specify no other fields, running the template
     * will result in a naive, recursive copy from the template's root.
     */
    identity: string;
    
    /**
     * We only require two fields: name and identity. This is enough to identify
     * and run the template. If you specify no other fields, running the template
     * will result in a naive, recursive copy from the template's root.
     */
    name: string;

    /**
     * Used in case of naming collisions. Should be a reverse domain name.
     * Example: com.example.foo.
     */
    scope?: string;

    /**
     * The path of the template's source content relative to the template root
     * (which is the parent directory of .neoman.config/). If omitted, defaults
     * to the template root, itself.
     */
    root?: string;

    description?: string;
    author?: string;
    classifications?: string[];
    shortName?: string;
    tags?: {
        keywords: string[];
        language: string;

        [key: string]: string | string[];
    };

    /**
     * Section to define how to collect user input and what to collect.
     */
    input?: IInputConfig;

    /**
     * Array of transformations to apply to file content when running a
     * template. Applied conditionally (e.g., glob filters) and in-order.
     */
    transform?: Transforms;

    /**
     * Array of transformations to apply to paths when running a template.
     * Applied conditionally (e.g., glob filters) and in-order.
     */
    pathTransform?: PathTransforms;

    /**
     * List of files to include, if defined. Files not explicitly included
     * will be excluded. If section is left undefined, all files will be
     * included, by default.
     */
    files?: string[];

    /**
     * List of files to exclude. Applied after explicit inclusions,
     * and therefore overrides any inclusion.
     */
    ignore?: string[];

    /**
     * List of filter and transform configurations for use within input,
     * transform, and pathTransform sections. Also allows you to specify
     * plugins for the same purposes.
     */
    configurations?: IConfigurations;

    /**
     * Space reserved for user whims - will always be ignored by Neoman, itself.
     * It's true that, in all probability, we will never try to snatch a key like
     * "__ILovePandas__" out from under you. However, this is the only
     * place within which we guarantee it.
     * 
     * Note: Plugins should use designated "options" and "configurations" sections
     * for their custom settings.
     */
    whims?: any;
}