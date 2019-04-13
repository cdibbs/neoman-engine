import { IOptions, IGlob } from 'glob';

export interface IGlobFactory {
    build(pattern: string, options: IOptions): IGlob;
}