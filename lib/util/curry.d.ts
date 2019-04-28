export declare namespace curry {
    function bindOnly<TThis, T1, TP1>(fn: (a: TP1) => T1, self: TThis): (a: TP1) => T1;
    function bindOnly<TThis, T1, TP1, TP2>(fn: (a: TP1, b: TP2) => T1, self: TThis): (a: TP1, b: TP2) => T1;
    function oneOf1<TThis, T1, T2, T3>(fn: (a: T1, b: T2) => T3, self: TThis, a: T1): () => T3;
    function oneOf2<TThis, T1, T2, T3>(fn: (a: T1, b: T2) => T3, self: TThis, a: T1): (a: T2) => T3;
    function oneOf3<TThis, T1, T2, T3, T4>(fn: (a: T1, b: T2, c: T3) => T4, self: TThis, a: T1): (a: T2, b: T3) => T4;
    function twoOf2<TThis, T1, T2, T3>(fn: (a: T1, b: T2) => T3, self: TThis, a: T1, b: T2): () => T3;
    function twoOf3<TThis, T1, T2, T3, T4>(fn: (a: T1, b: T2, c: T3) => T4, self: TThis, a: T1, b: T2): (a: T3) => T4;
    function twoOf4<TThis, T1, T2, T3, T4, T5>(fn: (a: T1, b: T2, c: T3, d: T4) => T5, self: TThis, a: T1, b: T2): (a: T3, b: T4) => T5;
    function threeOf4<TThis, T1, T2, T3, T4, T5>(fn: (a: T1, b: T2, c: T3, d: T4) => T5, self: TThis, a: T1, b: T2, c: T3): (b: T4) => T5;
    function fourOf5<TThis, T1, T2, T3, T4, T5, T6>(fn: (a: T1, b: T2, c: T3, d: T4, e: T5) => T6, self: TThis, a: T1, b: T2, c: T3, d: T4): (e: T5) => T6;
    function fiveOf6<TThis, T1, T2, T3, T4, T5, T6, T7>(fn: (a: T1, b: T2, c: T3, d: T4, e: T5, f: T6) => T7, self: TThis, a: T1, b: T2, c: T3, d: T4, e: T5): (a: T6) => T7;
    function sixOf7<TThis, T1, T2, T3, T4, T5, T6, T7>(fn: (a: T1, b: T2, c: T3, d: T4, e: T5, f: T6) => T7, self: TThis, a: T1, b: T2, c: T3, d: T4, e: T5, f: T6): (a: T6) => T7;
}
