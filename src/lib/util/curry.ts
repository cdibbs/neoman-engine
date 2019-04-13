export namespace curry {    

    export function bindOnly<TThis, T1, TP1>(
        fn: (a: TP1) => T1,
        self: TThis): (a: TP1) => T1;
    export function bindOnly<TThis, T1, TP1, TP2>(
        fn: (a: TP1, b: TP2) => T1,
        self: TThis): (a: TP1, b: TP2) => T1;
    export function bindOnly<TThis, T1>(
        fn: (...args: any[]) => T1,
        self: TThis): () => T1
    {
        return fn.bind(self);
    }

    export function oneOf1<TThis, T1, T2, T3>(
        fn: (a: T1, b: T2) => T3,
        self: TThis,
        a: T1
    ): () => T3
    {
        return fn.bind(self, a);
    }

    export function oneOf2<TThis, T1, T2, T3>(
        fn: (a: T1, b: T2) => T3,
        self: TThis,
        a: T1
    ): (a: T2) => T3
    {
        return fn.bind(self, a);
    }
    
    export function oneOf3<TThis, T1, T2, T3, T4>(
        fn: (a: T1, b: T2, c: T3) => T4,
        self: TThis,
        a: T1
    ): (a: T2, b: T3) => T4
    {
        return fn.bind(self, a);
    }

    export function twoOf3<TThis, T1, T2, T3, T4>(
        fn: (a: T1, b: T2, c: T3) => T4,
        self: TThis,
        a: T1,
        b: T2): (a: T3) => T4
    {
        return fn.bind(self, a, b);
    }

    export function twoOf4<TThis, T1, T2, T3, T4, T5>(
        fn: (a: T1, b: T2, c: T3, d: T4) => T5,
        self: TThis,
        a: T1,
        b: T2): (a: T3, b: T4) => T5
    {
        return fn.bind(self, a, b);
    }

    export function threeOf4<TThis, T1, T2, T3, T4, T5>(
                fn: (a: T1, b: T2, c: T3, d: T4) => T5,
        self: TThis,
        a: T1,
        b: T2,
        c: T3): (b: T4) => T5
    {
        return fn.bind(self, a, b, c);
    }

    export function fourOf5<TThis, T1, T2, T3, T4, T5, T6>(
        fn: (a: T1, b: T2, c: T3, d: T4, e: T5) => T6,
        self: TThis,
        a: T1,
        b: T2,
        c: T3,
        d: T4): (e: T5) => T6
    {
        return fn.bind(self, a, b, c, d);
    }

    export function fiveOf6<TThis, T1, T2, T3, T4, T5, T6, T7>(
        fn: (a: T1, b: T2, c: T3, d: T4, e: T5, f: T6) => T7,
        self: TThis,
        a: T1,
        b: T2,
        c: T3,
        d: T4,
        e: T5): (a: T6) => T7 {
        return fn.bind(self, a, b, c, d, e);
    }

    export function sixOf7<TThis, T1, T2, T3, T4, T5, T6, T7>(
        fn: (a: T1, b: T2, c: T3, d: T4, e: T5, f: T6) => T7,
        self: TThis,
        a: T1,
        b: T2,
        c: T3,
        d: T4,
        e: T5,
        f: T6): (a: T6) => T7 {
        return fn.bind(self, a, b, c, d, e, f);
    }
}