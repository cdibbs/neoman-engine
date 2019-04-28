import { ITemplateContentFile } from "../i";
import { DiscoveryDecision } from "./discovery-decision";

export class Discovery {
    public error: Error = null;
    public file: ITemplateContentFile = null;
    public decision: DiscoveryDecision = null;
    public count: number = 0;
}