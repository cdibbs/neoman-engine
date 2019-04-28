import { MapperProfile } from './models/mapper-profile';
export declare class Mapper {
    map<TSource, TDest>(sourceObj: TSource, destType: {
        new (): TDest;
    }, profile?: MapperProfile<TSource, TDest>): TDest;
    mapOnto<TSource, TDest>(sourceObj: TSource, destObj: TDest, profile?: MapperProfile<TSource, TDest>): TDest;
    private beforeMap;
    private mapWithProfile;
    private mapPropWithExceptions;
    private mapSimple;
}
