import { injectable, inject } from 'inversify';
import { ISettingsProvider, IPath, IFileSystem } from './i';
import TYPES from './di/types';
import { IMapperService } from 'simple-mapper';

/**
 * Just a wrapper around the user-settings module, for now.
 */
@injectable()
export class SettingsProvider<T> implements ISettingsProvider {
    private filename: string = ".neoman-settings";
    private filepath: string;

    constructor(
        @inject(TYPES.SettingsType) private TSettings: { new (): T },
        @inject(TYPES.Process) private process: NodeJS.Process,
        @inject(TYPES.Mapper) private mapper: IMapperService,
        @inject(TYPES.FS) private fs: IFileSystem,
        @inject(TYPES.Path) private path: IPath
    ) {
        const homedir = this.process.env.HOME || this.process.env.USERPROFILE;
        this.filepath = this.path.join(homedir, this.filename);
    }

    get(key: string): T {
        const settings = this.readSettings();
        return settings[key];
    }

    set(key: string, value: any): void {
        const settings = this.readSettings();
        settings[key] = value;
        this.fs.writeFileSync(this.filepath, JSON.stringify(settings, null, 2));
    }

    readSettings(): T {
        const raw = this.readFileJSON(this.filepath);
        return this.mapper.map<T>(this.TSettings, raw);
    }

    readFileJSON(filepath: string): any {
        let rawData = '{}' /* default data */;
        let options: any = {};
        try {
            rawData = this.fs.readFileSync(filepath, "ascii");
        } catch (err) {
            if (err.code === 'ENOENT') {
                this.fs.writeFileSync(filepath, rawData);
            } else {
                throw err;
            }
        }

        try {
            options = JSON.parse(rawData);
        } catch (err) {
            err.filepath = filepath;
            throw err;
        }

        return options;
    }
}