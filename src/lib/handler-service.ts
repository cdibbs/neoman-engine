import { injectable, inject } from 'inversify';
let NestedError = require('nested-error-stacks');
import * as fse from 'fs-extra';
import TYPES from './di/types';
import { IHandlerService, IPath, IUserMessager } from './i';

@injectable()
export class HandlerService implements IHandlerService {
    constructor(
        @inject(TYPES.Path) private path: IPath,
        @inject(TYPES.UserMessager) private msg: IUserMessager
    ) {

    }

    // TODO FIXME Manually test file error scenarios to learn if this is the right approach...
    async resolveAndLoad(tmplConfigRootPath: string, handlerid: string): Promise<Function> {
        const handlerPath = this.path.join(tmplConfigRootPath, '.neoman.config', 'handlers');
        const handlerFile = this.ensureSupportedFormat(handlerPath, handlerid);
        const handlerFilePath = this.path.join(handlerPath, handlerFile);
        return this.resolveAndLoadFromPath(handlerFilePath);
    }

    protected async resolveAndLoadFromPath(handlerPath: string) {
        try {
            await this.access(handlerPath, fse.constants.R_OK);
        } catch (err) {
            const errorMessage = this.msg.mf('Could not access user-defined handler at {handlerPath}.', {handlerPath});
            throw new NestedError(errorMessage, err);
        }

        const hnd = this.requireNative(handlerPath);
        if (typeof hnd !== 'function') {
            const errorMessage = this.msg.mf('Handler definition at {handlerPath} was not a function.', {handlerPath});
            throw new Error(errorMessage);
        }
        return hnd;
    }

    private ensureSupportedFormat(handlerPath: string, id: string): string { // formatPath
        // For now, kis...

        if (! id.endsWith(".js")) {
            return id + ".js";
        }

        return id;
    }

    private requireNative = require;
    private access = fse.access;
}