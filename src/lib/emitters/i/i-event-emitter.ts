import * as Rx from 'rxjs';
import { IReadOnlyEventEmitter } from './i-readonly-event-emitter';

export interface IEventEmitter<ET extends { [key: string]: any }>
    extends IReadOnlyEventEmitter<ET>
{
    emit<EK extends keyof ET>(type: EK, data: ET[EK]): void;
}