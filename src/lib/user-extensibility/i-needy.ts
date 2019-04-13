import { ICapabilities } from "./i-capabilities";

export interface INeedy {
    /**
     * The desired capabilities (version, plugins...) of the Neoman environment.
     *  - Omit version to be guaranteed to use the latest version.
     *  - Include plugin identifiers to warn when missing.
     */
    readonly desiredCapabilities?: ICapabilities;

    /**
     * The required capabilities (version, plugins...) of the Neoman environment.
     *  - Include version to error out when actual version too low.
     *  - Include plugin identifiers error out when missing.
     */
    readonly requiredCapabilities?: ICapabilities;
}