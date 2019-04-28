var Mapper = /** @class */ (function () {
    function Mapper() {
    }
    Mapper.prototype.map = function (sourceObj, destType, profile) {
        if (profile === void 0) { profile = null; }
        if (profile === null)
            return this.mapSimple(sourceObj, new destType());
        var destObj = this.beforeMap(sourceObj, null, profile) || new destType();
        return this.mapWithProfile(sourceObj, destObj, profile);
    };
    Mapper.prototype.mapOnto = function (sourceObj, destObj, profile) {
        if (profile === void 0) { profile = null; }
        if (profile === null)
            return this.mapSimple(sourceObj, destObj);
        destObj = this.beforeMap(sourceObj, destObj, profile) || destObj;
        return this.mapWithProfile(sourceObj, destObj, profile);
    };
    Mapper.prototype.beforeMap = function (sourceObj, destObj, profile) {
        if (profile.beforeMap instanceof Function) {
            return profile.beforeMap(sourceObj, destObj, profile);
        }
    };
    Mapper.prototype.mapWithProfile = function (sourceObj, destObj, profile) {
        var key;
        for (key in destObj) {
            destObj[key] = this.mapPropWithExceptions(key, sourceObj, destObj, profile);
        }
        if (profile && profile.afterMap instanceof Function) {
            destObj = profile.afterMap(sourceObj, destObj, profile) || destObj;
        }
        return destObj;
    };
    Mapper.prototype.mapPropWithExceptions = function (key, sourceObj, destObj, profile) {
        var _this = this;
        var exceptions = profile.exceptions;
        if (!exceptions || exceptions[key] === undefined) {
            return sourceObj[key];
        }
        if (typeof exceptions[key] === 'string') {
            return sourceObj[exceptions[key]];
        }
        if (exceptions[key] instanceof Function) {
            return exceptions[key](sourceObj, destObj, profile);
        }
        if (exceptions[key] instanceof Array) {
            return exceptions[key]
                .reduce(function (e) { return _this.mapPropWithExceptions(key, sourceObj, e, profile); }, destObj);
        }
        throw new Error("Error mapping " + sourceObj.constructor.name + " to " + destObj.constructor.name
            + (": exception definition for key '" + key + "' not understood."));
    };
    Mapper.prototype.mapSimple = function (sourceObj, destObj) {
        var key;
        for (key in destObj) {
            destObj[key] = sourceObj[key];
        }
        return destObj;
    };
    return Mapper;
}());
export { Mapper };
//# sourceMappingURL=mapper.js.map