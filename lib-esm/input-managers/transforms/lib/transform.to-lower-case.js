var ToLowerCaseTransform = /** @class */ (function () {
    function ToLowerCaseTransform() {
        this.key = "toLowerCase";
    }
    ToLowerCaseTransform.prototype.transform = function (input) {
        return input ? input.toLowerCase() : input;
    };
    return ToLowerCaseTransform;
}());
export { ToLowerCaseTransform };
//# sourceMappingURL=transform.to-lower-case.js.map