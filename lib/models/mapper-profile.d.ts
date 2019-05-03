import { MappingExceptions } from './mapping-exceptions';
export declare type MappingHook<TSource, TDest> = (src?: TSource, dest?: TDest, profile?: MapperProfile<TSource, TDest>) => TDest | void;
export declare class MapperProfile<TSource, TDest> {
    /** Destination properties to ignore. Overrides exceptions. */
    ignore?: Array<keyof TDest>;
    /** Destination mapping exceptions. */
    exceptions?: MappingExceptions<TSource, TDest>;
    /** Hook to call after mapping is done. */
    afterMap?: MappingHook<TSource, TDest>;
    /** Hook to call before mapping begins. */
    beforeMap?: MappingHook<TSource, TDest>;
    destType?: {
        new (...args: any[]): TDest;
    };
}
