import { ITemplate } from '../i';
import { TemplateManagerError } from '../template-management/template-manager-error';

export type TemplateSearchEmitterType = {
    "error": TemplateManagerError,
    "match": ITemplate,
    "end": ITemplate[]
};