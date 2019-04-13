import { Stats } from 'fs';

export interface IFileSystem {
    statSync(path: string | Buffer): Stats;
    readFileSync(path: string | Buffer, encoding: string): string;
    writeFileSync(path: string | Buffer, content: string | Buffer): void;
    readdirSync(path: string): string[];
}