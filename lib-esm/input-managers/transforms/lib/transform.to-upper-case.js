var ToUpperCaseTransform = /** @class */ (function () {
    function ToUpperCaseTransform() {
        this.key = "toUpperCase";
    }
    ToUpperCaseTransform.prototype.transform = function (input) {
        return input ? input.toUpperCase() : input;
    };
    return ToUpperCaseTransform;
}());
export { ToUpperCaseTransform };
//# sourceMappingURL=transform.to-upper-case.js.map