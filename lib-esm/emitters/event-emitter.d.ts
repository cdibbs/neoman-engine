import * as Rx from 'rxjs';
import { IEventEmitter } from './i';
export declare class EventEmitter<ET extends {
    [key: string]: any;
}> implements IEventEmitter<ET> {
    subjects: {
        [key in keyof ET]?: Rx.Subject<any>;
    };
    emit<EK extends keyof ET>(type: EK, data: ET[EK]): void;
    on<EK extends keyof ET>(type: EK, fn: (value: ET[EK]) => any): Rx.Subscription;
}
