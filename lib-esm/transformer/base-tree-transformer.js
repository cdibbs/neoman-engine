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
import { curry } from '../util/curry';
import { mergeMap } from 'rxjs/operators';
var BaseTreeTransformer = /** @class */ (function () {
    function BaseTreeTransformer(msg, pathTransformManager, transformManager) {
        this.msg = msg;
        this.pathTransformManager = pathTransformManager;
        this.transformManager = transformManager;
    }
    BaseTreeTransformer.prototype.register = function (source, tmpl, options, inputs) {
        this.transformManager.configure(tmpl, inputs);
        this.pathTransformManager.configure(tmpl, inputs);
        var transformer = curry.threeOf4(this.transform, this, tmpl.pathTransform, tmpl.transform, options.verbosity);
        return source.pipe(mergeMap(transformer));
    };
    BaseTreeTransformer = __decorate([
        injectable(),
        __param(0, inject(TYPES.UserMessager)),
        __param(1, inject(TYPES.PathTransformManager)),
        __param(2, inject(TYPES.TransformManager)),
        __metadata("design:paramtypes", [Object, Object, Object])
    ], BaseTreeTransformer);
    return BaseTreeTransformer;
}());
export { BaseTreeTransformer };
//# sourceMappingURL=base-tree-transformer.js.map