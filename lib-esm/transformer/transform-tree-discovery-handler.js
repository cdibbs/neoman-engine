var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { BaseTreeDiscoveryHandler } from "./base-tree-discovery-handler";
import { TemplateContentFile } from "../models/template-content-file";
import { inject } from "inversify";
import TYPES from "../di/types";
import { Mapper } from "../mapper";
import { curry } from "../util";
import { MapOption } from "../models";
var NestedError = require('nested-error-stacks');
var TransformTreeDiscoveryHandler = /** @class */ (function (_super) {
    __extends(TransformTreeDiscoveryHandler, _super);
    function TransformTreeDiscoveryHandler(msg, pathTransformManager, transformManager, path, mapper) {
        var _this = _super.call(this, msg, pathTransformManager, transformManager) || this;
        _this.msg = msg;
        _this.pathTransformManager = pathTransformManager;
        _this.transformManager = transformManager;
        _this.path = path;
        _this.mapper = mapper;
        return _this;
    }
    TransformTreeDiscoveryHandler.prototype.matchTmplFile = function (output, pathTransforms, contentTransforms, verbosity, tmplFile) {
        return __awaiter(this, void 0, void 0, function () {
            var transformed, _a, ex_1, msg;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        this.msg.i18n({ absPath: tmplFile.absolutePath }).debug("Include: {absPath}");
                        transformed = this.mapper.map(tmplFile, TemplateContentFile, { exceptions: { "getContents": MapOption.Ignore } });
                        transformed.hasContents = true;
                        transformed.getContents = curry.twoOf2(this.contentBuilder, this, contentTransforms, tmplFile);
                        this.msg.i18n({ absPath: tmplFile.absolutePath })
                            .info("Transforming path '{absPath}'...");
                        _a = transformed;
                        return [4 /*yield*/, this.pathTransformManager.applyTransforms(tmplFile.relativePath, pathTransforms)];
                    case 1:
                        _a.relativePath = _b.sent();
                        output.emit("match", transformed);
                        return [3 /*break*/, 3];
                    case 2:
                        ex_1 = _b.sent();
                        msg = this.msg
                            .i18n({ path: tmplFile.absolutePath })
                            .mf("Unexpected error while transforming '{path}'.");
                        output.emit("error", new NestedError(msg, ex_1));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TransformTreeDiscoveryHandler.prototype.contentBuilder = function (transforms, tmplFile) {
        return __awaiter(this, void 0, void 0, function () {
            var content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, , 3, 4]);
                        this.msg.i18n().debug("Applying content transforms...", 1);
                        return [4 /*yield*/, tmplFile.getContents()];
                    case 1:
                        content = _a.sent();
                        return [4 /*yield*/, this.transformManager.applyTransforms(tmplFile.relativePath, content, transforms)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        this.msg.i18n().debug('Done.', 1);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TransformTreeDiscoveryHandler = __decorate([
        __param(0, inject(TYPES.UserMessager)),
        __param(1, inject(TYPES.PathTransformManager)),
        __param(2, inject(TYPES.TransformManager)),
        __param(3, inject(TYPES.Path)),
        __metadata("design:paramtypes", [Object, Object, Object, Object, Mapper])
    ], TransformTreeDiscoveryHandler);
    return TransformTreeDiscoveryHandler;
}(BaseTreeDiscoveryHandler));
export { TransformTreeDiscoveryHandler };
//# sourceMappingURL=transform-tree-discovery-handler.js.map