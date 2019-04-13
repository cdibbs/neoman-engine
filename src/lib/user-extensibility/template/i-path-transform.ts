import { ITransformFilter } from './i-transform-filter';
import { IWithDefinition } from './i-with-definition';

export interface IPathTransform extends ITransformFilter {
    subject: string;
    with: string | IWithDefinition;
    regexFlags?: string;
    params?: any;
}