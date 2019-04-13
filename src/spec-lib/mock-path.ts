import { IPath } from '../lib/i';

export let mockPathFactory = (sep: string = "/") => {
    return <IPath> {
        sep: sep,
        join: (...args: any[]) => args.join(sep),
        dirname: (...args: any[]) => "",
        resolve: () => ""
    };
}