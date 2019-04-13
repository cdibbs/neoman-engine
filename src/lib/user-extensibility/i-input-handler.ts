import { ICapabilitiesHelper } from "./i-capabilities-helper";
import { IInputConfig } from "./template";

export interface IInputHandler {
    /**
     * A simple, exported function which returns a dictionary of template variable
     * definitions when provided an IInputConfig object from the template.json.
     * @param capabilities A capabilities helper object to check version compatibility.
     * @param config An optional IInputConfig object from a template.json.
     */
    (capabilities: ICapabilitiesHelper, config?: IInputConfig): { [key: string]: any };
}