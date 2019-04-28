import { DiscoveryDecision } from "./discovery-decision";

export type TransformDecision =
    DiscoveryDecision
    & {
        "path": "path",
        "contents": "contents",
        "pathAndContents": "pathAndContents"
    }