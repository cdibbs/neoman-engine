import { ITransformFilter } from './i-transform-filter';
import { IWithDefinition } from './i-with-definition';
import { ISubjectDefinition } from './i-subject-definition';

export interface ITransform extends ITransformFilter {
    section?: ITransformFilter;
    subject: string | ISubjectDefinition;
    with?: string | IWithDefinition;
    regexFlags?: string;
    params?: any;
}