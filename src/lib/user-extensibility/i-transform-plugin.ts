import { ICapabilitiesHelper } from "./i-capabilities-helper";
import { INeedy } from "./i-needy";
import { ISubjectDefinition } from "./template/i-subject-definition";

export interface ITransformPlugin extends INeedy {
    /**
     * Method called shortly after instantiation with user-provided, plugin-defined options.
     * Called before any calls to transform(...).
     * @param {ICapabilitiesHelper} capabilitiesHelper An object describing tool version, all available
     *              plugins, etc. Contains helper methods for checking compatibility.
     * @param {any} pluginOptions plugin-defined options. Provided in template.json with the
     *              key path '$.configurations.{some-config}.pluginConfig'
     */
    configure(capabilities: ICapabilitiesHelper, pluginOptions?: any): Promise<void>;

    /**
     * Method to perform transform of original content/path. Returns whole content, not only
     * a replacement value.
     * @param {string} path The path of the file to transform
     * @param {string} original The original content (including any transforms applied to it,
     *        up to this point)
     * @param {string | ISubjectDefinition} subject The subject which was located (often, a
     *        regular expression or a string).
     * @param {string | Function } transformOrTransformer A transform value
     *        or transform function suggested by the configuration.
     * @param {any} pluginOptions Options specific to this transform (as opposed to options
     *        provided to the configure(...) call.)
     */
    transform(
        path: string,
        original: string,
        subject: string | ISubjectDefinition,
        transformOrTransformer: string | ((subj: string) => string),
        pluginOptions: any): Promise<string>;
}