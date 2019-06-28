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
import { RunOptions } from "../models";
import { curry } from '../util/curry';
import { mergeMap } from 'rxjs/operators';
let BaseTreeTransformer = class BaseTreeTransformer {
    constructor(msg, pathTransformManager, transformManager) {
        this.msg = msg;
        this.pathTransformManager = pathTransformManager;
        this.transformManager = transformManager;
    }
    register(source, tmpl, inputs, options = new RunOptions()) {
        this.transformManager.configure(tmpl, inputs);
        this.pathTransformManager.configure(tmpl, inputs);
        const transformer = curry.fiveOf6(this.transform, this, tmpl.pathTransform, tmpl.transform, options.verbosity, tmpl.include, tmpl.exclude);
        return source.pipe(mergeMap(transformer));
    }
};
BaseTreeTransformer = __decorate([
    injectable(),
    __param(0, inject(TYPES.UserMessager)),
    __param(1, inject(TYPES.PathTransformManager)),
    __param(2, inject(TYPES.TransformManager)),
    __metadata("design:paramtypes", [Object, Object, Object])
], BaseTreeTransformer);
export { BaseTreeTransformer };
//# sourceMappingURL=base-tree-transformer.js.map