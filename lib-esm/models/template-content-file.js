var TemplateContentFile = /** @class */ (function () {
    function TemplateContentFile() {
        this.relativePath = null;
        this.absolutePath = null;
        this.isDirectory = false;
        this.size = 0;
        this.includedBy = [];
        this.excludedBy = [];
        this.hasContents = false;
        this.getContents = function () { return Promise.reject("Never initialized."); };
    }
    return TemplateContentFile;
}());
export { TemplateContentFile };
//# sourceMappingURL=template-content-file.js.map