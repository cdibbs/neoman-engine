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
import { inject, injectable } from 'inversify';
import TYPES from '../di/types';
import { VERBOSITY } from '../types/verbosity';
import { curry } from '../util/curry';
var BaseTreeDiscoveryHandler = /** @class */ (function () {
    function BaseTreeDiscoveryHandler(msg, pathTransformManager, transformManager) {
        this.msg = msg;
        this.pathTransformManager = pathTransformManager;
        this.transformManager = transformManager;
    }
    BaseTreeDiscoveryHandler.prototype.register = function (source, output, tmpl, options, inputs) {
        this.transformManager.configure(tmpl, inputs);
        this.pathTransformManager.configure(tmpl, inputs);
        source.on('match', curry.fourOf5(this.matchTmplFile, this, output, tmpl.pathTransform, tmpl.transform, options.verbosity));
        source.on('tentative', curry.twoOf3(this.tentativeMatchTmplFile, this, output, options.verbosity));
        source.on('error', curry.bindOnly(this.templateError, this));
        if (options.verbosity === VERBOSITY.debug || options.showExcluded) {
            source.on('exclude', this.excludeMatchTmplFile.bind(this));
        }
    };
    // directories not explicitly matched or excluded.
    BaseTreeDiscoveryHandler.prototype.tentativeMatchTmplFile = function (output, verbosity, tmplFile) {
        if (verbosity === VERBOSITY.debug) {
            this.msg
                .i18n({ relPath: tmplFile.relativePath })
                .debug('Tentative: {relPath}');
        }
    };
    BaseTreeDiscoveryHandler.prototype.excludeMatchTmplFile = function (tmplFile) {
        this.msg
            .i18n({ relPath: tmplFile.relativePath })
            .debug('Exclude: {relPath}');
    };
    BaseTreeDiscoveryHandler.prototype.templateError = function (err) {
        this.msg.error(err.stack);
    };
    BaseTreeDiscoveryHandler = __decorate([
        injectable(),
        __param(0, inject(TYPES.UserMessager)),
        __param(1, inject(TYPES.PathTransformManager)),
        __param(2, inject(TYPES.TransformManager)),
        __metadata("design:paramtypes", [Object, Object, Object])
    ], BaseTreeDiscoveryHandler);
    return BaseTreeDiscoveryHandler;
}());
export { BaseTreeDiscoveryHandler };
//# sourceMappingURL=base-tree-discovery-handler.js.map