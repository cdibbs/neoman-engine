var ToLocaleLowerCaseTransform = /** @class */ (function () {
    function ToLocaleLowerCaseTransform() {
        this.key = "toLocaleLowerCase";
    }
    ToLocaleLowerCaseTransform.prototype.transform = function (input) {
        return input ? input.toLocaleLowerCase() : input;
    };
    return ToLocaleLowerCaseTransform;
}());
export { ToLocaleLowerCaseTransform };
//# sourceMappingURL=transform.to-locale-lower-case.js.map