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
import { injectable, inject } from "inversify";
import TYPES from "../di/types";
var InputApi = /** @class */ (function () {
    function InputApi(msg, regexer, trans) {
        this.msg = msg;
        this.regexer = regexer;
        this.trans = trans;
        this.splitter = new RegExp(/^\/(.*(?!\\))\/(.*)\/([gimuy]*)$/);
    }
    InputApi.prototype.derive = function (def, values) {
        var sourceVal = values[def.derivedFrom];
        var trans = this.buildTransformDef(def);
        var handlers = this.buildHandlersDict(trans.modify);
        return this.regexer.transform(sourceVal, trans.match, trans.replace, handlers);
    };
    InputApi.prototype.buildTransformDef = function (def) {
        if (typeof def.transform === "string") {
            var components = def.transform.match(this.splitter);
            if (!components || components.length < 5) {
                throw new Error(this.msg.mf("Must be a valid javascript replace regular expression: /pattern/replace/[opts]"));
            }
            return {
                match: "/" + components[1] + "/" + components[3],
                replace: components[2],
                modify: {}
            };
        }
        else if (typeof def.transform === "object") {
            return def.transform;
        }
        else {
            throw new Error(this.msg.mf("Unrecognized input transform definition. Type: " + typeof def.transform + "."));
        }
    };
    InputApi.prototype.buildHandlersDict = function (modifyDefs) {
        var keys = Object.keys(modifyDefs);
        var dict = {};
        for (var key in keys) {
            var t = this.trans.get(key);
            if (!t) {
                throw new Error(this.msg.mf("Unrecognized built-in transform: " + key + "."));
            }
            dict[key] = t.transform;
        }
        return dict;
    };
    InputApi = __decorate([
        injectable(),
        __param(0, inject(TYPES.UserMessager)),
        __param(1, inject(TYPES.Regexer)),
        __param(2, inject(TYPES.BuiltinTransforms)),
        __metadata("design:paramtypes", [Object, Object, Object])
    ], InputApi);
    return InputApi;
}());
export { InputApi };
//# sourceMappingURL=input-api.js.map