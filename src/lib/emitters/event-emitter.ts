import * as Rx from 'rxjs';
import { IEventEmitter } from './i';

let bob: string = "hello";

export class EventEmitter<ET extends { [key: string]: any }> implements IEventEmitter<ET> {
    subjects: { [key in keyof ET]?: Rx.Subject<any> } = {};

    emit<EK extends keyof ET>(type: EK, data: ET[EK]): void {
        this.subjects[type] || (this.subjects[type] = new Rx.Subject<ET[EK]>());
        this.subjects[type].next(data);
    }

    on<EK extends keyof ET>(type: EK, fn: (value: ET[EK]) => any): Rx.Subscription {
        this.subjects[type] || (this.subjects[type] = new Rx.Subject<ET[EK]>());
        return this.subjects[type].subscribe(fn);
    }
}