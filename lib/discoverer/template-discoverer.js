"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var operators_1 = require("rxjs/operators");
var types_1 = require("../di/types");
var util_1 = require("../util");
var TemplateDiscoverer = /** @class */ (function () {
    function TemplateDiscoverer(matcher) {
        this.matcher = matcher;
    }
    TemplateDiscoverer.prototype.find = function (source) {
        return source.pipe(operators_1.filter(util_1.curry.bindOnly(this.includeOnlyTemplates, this)));
    };
    TemplateDiscoverer.prototype.includeOnlyTemplates = function (file) {
        return this.matcher.isMatch(file.absolutePath, "*/.neoman.config/template.json");
    };
    TemplateDiscoverer = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(types_1.default.FilePatterns)),
        __metadata("design:paramtypes", [Object])
    ], TemplateDiscoverer);
    return TemplateDiscoverer;
}());
exports.TemplateDiscoverer = TemplateDiscoverer;
//# sourceMappingURL=template-discoverer.js.map