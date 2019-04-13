import { Stats } from 'fs';
import { IFileSystem } from '../lib/i';

export let mockFSFactory = () => {
    return <IFileSystem> {
            readdirSync: (...args: any[]) => [],
            statSync: (...args: any[]) => <Stats>{},
            readFileSync: (...args: any[]) => "",
            writeFileSync: (...args: any[]) => {}
        };
}