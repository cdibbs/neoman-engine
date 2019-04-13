import { inject, injectable } from 'inversify';
import TYPES from '../../di/types';
import * as i from '../../i';
import { RunOptions } from '../../models';
import { IInputConfig } from '../../user-extensibility';
import { BaseInputManager } from '../base-input-manager';
var NestedError = require('nested-error-stacks');


@injectable()
export class CustomInputManager extends BaseInputManager {
    constructor(
        @inject(TYPES.HandlerService) private handlerService: i.IHandlerService
    ) {
        super();
    }

    async ask(config: IInputConfig, options: RunOptions): Promise<{ [key: string]: any }> {
        try {
            const handler: Function = await this.handlerService
                .resolveAndLoad(this.tmplRootPath, config.handler);
            return handler(config);
        } catch (ex) {
            throw new NestedError("Error running handler for input configuration", ex);
        }
    }
}