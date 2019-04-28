import { MapperProfile } from './models/mapper-profile';
import {  MappingExceptionRule } from './models/mapping-exceptions';

export class Mapper {
    map<TSource, TDest>(
        sourceObj: TSource,
        destType: { new(): TDest },
        profile: MapperProfile<TSource, TDest> = null
    ): TDest {
        if (profile === null)
            return this.mapSimple(sourceObj, new destType());

        const destObj = this.beforeMap(sourceObj, null, profile) || new destType();
        return this.mapWithProfile(sourceObj, destObj, profile);
    }

    mapOnto<TSource, TDest>(
        sourceObj: TSource,
        destObj: TDest,
        profile: MapperProfile<TSource, TDest> = null
    ): TDest {
        if (profile === null)
            return this.mapSimple(sourceObj, destObj);

        destObj = this.beforeMap(sourceObj, destObj, profile) || destObj;
        return this.mapWithProfile(sourceObj, destObj, profile);
    }

    private beforeMap<TSource, TDest>(
        sourceObj: TSource,
        destObj: TDest,
        profile: MapperProfile<TSource, TDest>
    ): TDest | void {
        if (profile.beforeMap instanceof Function) {
            return profile.beforeMap(sourceObj, destObj, profile);
        }
    }

    private mapWithProfile<TSource, TDest>(
        sourceObj: TSource,
        destObj: TDest,
        profile: MapperProfile<TSource, TDest>
    ): TDest {
        let key: string;
        for(key in destObj) {
            destObj[key] = this.mapPropWithExceptions(key, sourceObj, destObj, profile);
        }

        if (profile && profile.afterMap instanceof Function) {
            destObj = profile.afterMap(sourceObj, destObj, profile) || destObj;
        }

        return destObj;
    }

    private mapPropWithExceptions<TSource, TDest>(
        key: string,
        sourceObj: TSource,
        destObj: TDest,
        profile: MapperProfile<TSource, TDest>
    ): any {
        const exceptions = profile.exceptions;
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
            return (<MappingExceptionRule<TSource>[]>exceptions[key])
                .reduce(e => this.mapPropWithExceptions(key, sourceObj, e, profile), destObj);
        }

        throw new Error(
            `Error mapping ${sourceObj.constructor.name} to ${destObj.constructor.name}`
            + `: exception definition for key '${key}' not understood.`);
    }

    private mapSimple<TSource, TDest>(
        sourceObj: TSource,
        destObj: TDest
    ): TDest {
        let key: string;
        for(key in destObj) {
            destObj[key] = sourceObj[key];
        }
        return destObj;
    }
}