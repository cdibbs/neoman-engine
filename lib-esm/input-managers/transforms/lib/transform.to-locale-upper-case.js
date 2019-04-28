var ToLocaleUpperCaseTransform = /** @class */ (function () {
    function ToLocaleUpperCaseTransform() {
        this.key = "toLocaleUpperCase";
    }
    ToLocaleUpperCaseTransform.prototype.transform = function (input) {
        return input ? input.toLocaleUpperCase() : input;
    };
    return ToLocaleUpperCaseTransform;
}());
export { ToLocaleUpperCaseTransform };
//# sourceMappingURL=transform.to-locale-upper-case.js.map