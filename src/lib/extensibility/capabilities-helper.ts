import { ICapabilities, ICapabilitiesHelper, ICapabilitiesResult } from "../user-extensibility";

export class CapabilitiesHelper implements ICapabilitiesHelper {
    constructor(
        public readonly version: string,
        public readonly plugins: string[]
    ) {}

    compare(capabilities: ICapabilities): ICapabilitiesResult {
        throw new Error("Method not implemented.");
    }
    
    satisfy(capabilities: ICapabilities): boolean {
        throw new Error("Method not implemented.");
    }
}