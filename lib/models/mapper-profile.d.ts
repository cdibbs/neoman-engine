import { MappingExceptions } from './mapping-exceptions';
export declare type MappingHook<TSource, TDest> = (src?: TSource, dest?: TDest, profile?: MapperProfile<TSource, TDest>) => TDest | void;
export declare class MapperProfile<TSource, TDest> {
    exceptions?: MappingExceptions<TSource, TDest>;
    afterMap?: MappingHook<TSource, TDest>;
    beforeMap?: MappingHook<TSource, TDest>;
    destType?: {
        new (...args: any[]): TDest;
    };
}
