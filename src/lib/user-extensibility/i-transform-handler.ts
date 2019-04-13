import { ICapabilitiesHelper } from "./i-capabilities-helper";

export interface ITransformHandler {
    /**
     * A simple, exported function which takes a Neoman capabilities object,
     * a source string, and some optional, custom parameters, and applies
     * a given transform to the source string.
     * @param capabilities A capabilities helper object to check version compatibility.
     * @param source The source string to transform.
     * @param params A custom parameters object, as defined in the template.json.
     */
    (capabilities: ICapabilitiesHelper, source: string, params?: any): string;
}