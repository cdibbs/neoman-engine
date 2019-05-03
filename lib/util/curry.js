export var curry;
(function (curry) {
    function bindOnly(fn, self) {
        return fn.bind(self);
    }
    curry.bindOnly = bindOnly;
    function oneOf1(fn, self, a) {
        return fn.bind(self, a);
    }
    curry.oneOf1 = oneOf1;
    function oneOf2(fn, self, a) {
        return fn.bind(self, a);
    }
    curry.oneOf2 = oneOf2;
    function oneOf3(fn, self, a) {
        return fn.bind(self, a);
    }
    curry.oneOf3 = oneOf3;
    function twoOf2(fn, self, a, b) {
        return fn.bind(self, a, b);
    }
    curry.twoOf2 = twoOf2;
    function twoOf3(fn, self, a, b) {
        return fn.bind(self, a, b);
    }
    curry.twoOf3 = twoOf3;
    function twoOf4(fn, self, a, b) {
        return fn.bind(self, a, b);
    }
    curry.twoOf4 = twoOf4;
    function threeOf4(fn, self, a, b, c) {
        return fn.bind(self, a, b, c);
    }
    curry.threeOf4 = threeOf4;
    function fourOf5(fn, self, a, b, c, d) {
        return fn.bind(self, a, b, c, d);
    }
    curry.fourOf5 = fourOf5;
    function fiveOf6(fn, self, a, b, c, d, e) {
        return fn.bind(self, a, b, c, d, e);
    }
    curry.fiveOf6 = fiveOf6;
    function sixOf7(fn, self, a, b, c, d, e, f) {
        return fn.bind(self, a, b, c, d, e, f);
    }
    curry.sixOf7 = sixOf7;
})(curry || (curry = {}));
//# sourceMappingURL=curry.js.map