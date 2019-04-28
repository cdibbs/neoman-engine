import { ITemplateContentFile } from "../i/i-template-content-file";
export declare type TemplateContentFilesEmitterType = {
    "error": Error;
    "match": ITemplateContentFile;
    "tentative": ITemplateContentFile;
    "exclude": ITemplateContentFile;
    "end": number;
};
