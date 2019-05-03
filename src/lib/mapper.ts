import { MapperProfile } from './models/mapper-profile';
import {  MappingExceptionRule } from './models/mapping-exceptions';
import { injectable } from 'inversify';

@injectable()
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
        let key: keyof TDest;
        for(key in destObj) {
            this.mapPropWithExceptions(key, sourceObj, destObj, profile);
        }

        if (profile && profile.afterMap instanceof Function) {
            destObj = profile.afterMap(sourceObj, destObj, profile) || destObj;
        }

        return destObj;
    }

    private mapPropWithExceptions<TSource, TDest>(
        key: keyof TDest,
        sourceObj: TSource,
        destObj: TDest,
        profile: MapperProfile<TSource, TDest>
    ): void {
        const exceptions = profile.exceptions;
        if (profile.ignore && profile.ignore.indexOf(key) >= 0) {
            return;
        }

        if (!exceptions || exceptions[key] === undefined) {
            destObj[key] = <any>sourceObj[<string>key];
            return;
        }

        if (typeof exceptions[key] === 'string') {
            destObj[key] = <any>sourceObj[exceptions[<string>key]];
            return;
        }

        if (exceptions[key] instanceof Function) {
            destObj[key] = <any>exceptions[<string>key](sourceObj, destObj, profile);
            return;
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