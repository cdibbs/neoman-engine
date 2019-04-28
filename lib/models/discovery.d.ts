import { ITemplateContentFile } from "../i";
import { DiscoveryDecision } from "./discovery-decision";
export declare class Discovery {
    error: Error;
    file: ITemplateContentFile;
    decision: DiscoveryDecision;
    count: number;
}
