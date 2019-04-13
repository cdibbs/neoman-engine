import * as Rx from 'rxjs';

export interface IReadOnlyEventEmitter<ET extends { [key: string]: any }>
{
    on<EK extends keyof ET>(type: EK, fn: (value: ET[EK]) => any): Rx.Subscription;
}