import { ICapabilities } from "./i-capabilities";
import { ICapabilitiesResult } from "./i-capabilities-result";

export interface ICapabilitiesHelper extends ICapabilities {
    /**
     * Compares a set of Neoman ICapabilities with the running Neoman's ICapabilities.
     * Calculates a version tuple delta, and lists missing plugins.
     * @param capabilities The ICapabilities to compare with the current Neoman version.
     */
    compare(capabilities: ICapabilities): ICapabilitiesResult;

    /**
     * Compares the ICapabilities with that of the running version of Neoman and
     * determines whether it believes it satisfies them (whether the running version
     * is higher than the required version, and isn't missing any required plugins).
     * @param capabilities The ICapabilities to check.
     */
    satisfy(capabilities: ICapabilities): boolean;
}