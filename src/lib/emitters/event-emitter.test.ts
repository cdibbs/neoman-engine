import * as Rx from 'rxjs';
import { Assert } from "alsatian-fluent-assertions";
import { Test, AsyncSetup } from "alsatian";
import { EventEmitter } from "./event-emitter";
import { IMock, Mock, It, Times } from 'typemoq';

export class EventEmitterTests {
    emitter: EventEmitter<{ something: number, another: number }>;
    public constructor() {
        //console.log("called anew")
        //this.emitter = new EventEmitter<{ something: number, another: number }>();
    }

    @AsyncSetup
    public async setup(): Promise<any> {
        this.emitter = new EventEmitter<{ something: number, another: number }>();
    }

    @Test()
    public registersMultiple_CallsOnlyIntended(): void {
        const fn1Mock = Mock.ofInstance((v: number) => {});
        const fn2Mock = Mock.ofInstance((v: number) => {});
        const fn3Mock = Mock.ofInstance((v: number) => {});
        this.emitter.on("something", fn1Mock.object);
        this.emitter.on("something", fn2Mock.object);
        this.emitter.on("another", fn2Mock.object);
        this.emitter.emit("something", 314);
        this.emitter.emit("something", 1592);
        this.emitter.emit("something", 653);
        fn1Mock.verify(m => m(It.is(v => v === 314)), Times.once());
        fn1Mock.verify(m => m(It.is(v => v === 1592)), Times.once());
        fn1Mock.verify(m => m(It.is(v => v === 653)), Times.once());
        fn2Mock.verify(m => m(It.is(v => v === 314)), Times.once());
        fn2Mock.verify(m => m(It.is(v => v === 1592)), Times.once());
        fn2Mock.verify(m => m(It.is(v => v === 653)), Times.once());
        fn3Mock.verify(m => m(It.isAny()), Times.never());
    }

    @Test()
    public emit_doesntErrorWhenNoneRegistered() {
        const fn = () => this.emitter.emit("something", 314);
        Assert(fn).not.throws();
    }
}