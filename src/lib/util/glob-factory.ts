import { injectable } from 'inversify';

import { Glob, IOptions, IGlob } from 'glob';
import { IGlobFactory } from './i-glob-factory';

@injectable()
export class GlobFactory implements IGlobFactory {
    protected globClass: { new(ptrn: string, opts: IOptions): IGlob } = Glob;
    public build(pattern: string, options: IOptions): IGlob {
        return new this.globClass(pattern, options);
    }
}