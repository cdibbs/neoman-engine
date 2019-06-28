export class TemplateContentFile {
    constructor() {
        this.relativePath = null;
        this.absolutePath = null;
        this.isDirectory = false;
        this.size = 0;
        this.includedBy = [];
        this.excludedBy = [];
        this.exclude = false;
        this.originalRelativePath = null;
        this.originalAbsolutePath = null;
        this.hasContents = false;
        this.getContents = () => Promise.reject("Never initialized.");
    }
}
//# sourceMappingURL=template-content-file.js.map