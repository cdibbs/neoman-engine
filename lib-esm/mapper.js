var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from 'inversify';
let Mapper = class Mapper {
    map(sourceObj, destType, profile = null) {
        if (profile === null)
            return this.mapSimple(sourceObj, new destType());
        const destObj = this.beforeMap(sourceObj, null, profile) || new destType();
        return this.mapWithProfile(sourceObj, destObj, profile);
    }
    mapOnto(sourceObj, destObj, profile = null) {
        if (profile === null)
            return this.mapSimple(sourceObj, destObj);
        destObj = this.beforeMap(sourceObj, destObj, profile) || destObj;
        return this.mapWithProfile(sourceObj, destObj, profile);
    }
    beforeMap(sourceObj, destObj, profile) {
        if (profile.beforeMap instanceof Function) {
            return profile.beforeMap(sourceObj, destObj, profile);
        }
    }
    mapWithProfile(sourceObj, destObj, profile) {
        let key;
        for (key in destObj) {
            this.mapPropWithExceptions(key, sourceObj, destObj, profile);
        }
        if (profile && profile.afterMap instanceof Function) {
            destObj = profile.afterMap(sourceObj, destObj, profile) || destObj;
        }
        return destObj;
    }
    mapPropWithExceptions(key, sourceObj, destObj, profile) {
        const exceptions = profile.exceptions;
        if (profile.ignore && profile.ignore.indexOf(key) >= 0) {
            return;
        }
        if (!exceptions || exceptions[key] === undefined) {
            destObj[key] = sourceObj[key];
            return;
        }
        if (typeof exceptions[key] === 'string') {
            destObj[key] = sourceObj[exceptions[key]];
            return;
        }
        if (exceptions[key] instanceof Function) {
            destObj[key] = exceptions[key](sourceObj, destObj, profile);
            return;
        }
        throw new Error(`Error mapping ${sourceObj.constructor.name} to ${destObj.constructor.name}`
            + `: exception definition for key '${key}' not understood.`);
    }
    mapSimple(sourceObj, destObj) {
        let key;
        for (key in destObj) {
            destObj[key] = sourceObj[key];
        }
        return destObj;
    }
};
Mapper = __decorate([
    injectable()
], Mapper);
export { Mapper };
//# sourceMappingURL=mapper.js.map