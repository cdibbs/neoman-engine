import { ITemplateFile } from '../i';

export type TemplateFilesEmitterType = {
    "error": Error,
    "match": ITemplateFile,
    "tentative": ITemplateFile,
    "exclude": ITemplateFile
};