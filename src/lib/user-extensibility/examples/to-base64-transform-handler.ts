import { ICapabilities } from "../i-capabilities";
import { ICapabilitiesHelper } from "../i-capabilities-helper";
import { INeedy } from "../i-needy";
import { ITransformHandler } from "../i-transform-handler";


function toBase64TransformHandler(capabilities: ICapabilitiesHelper, source: string, params: any): string {
    if (! capabilities.satisfy(toBase64TransformHandler.desiredCapabilities)) {
        throw new Error(`Handler '${toBase64TransformHandler.name}' desires so much more. Yes, this should only have been a warning. What's your point?`);
    }

    return btoa(source || "");
}

// You can omit this, if you don't want to specify your requirements.
namespace toBase64TransformHandler {
    export const requiredCapabilities: ICapabilities = {
        version: "1.0.0-alpha.1",
        plugins: []
    };

    export const desiredCapabilities: ICapabilities = {
        version: "1.0.0",
        plugins: []
    };
}

/* This casting incantation ensures type safety in this odd scenario. Must be in this order. */
export = <INeedy> <typeof toBase64TransformHandler> <ITransformHandler> toBase64TransformHandler;