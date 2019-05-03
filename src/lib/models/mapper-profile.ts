import { MappingExceptions } from './mapping-exceptions';
export type MappingHook<TSource, TDest>
    = (src?: TSource, dest?: TDest, profile?: MapperProfile<TSource, TDest>)
        => TDest | void;

export class MapperProfile<TSource, TDest> {
    /** Destination properties to ignore. Overrides exceptions. */
    ignore?: Array<keyof TDest> = null;

    /** Destination mapping exceptions. */
    exceptions?: MappingExceptions<TSource, TDest> = null;

    /** Hook to call after mapping is done. */
    afterMap?: MappingHook<TSource, TDest> = null;

    /** Hook to call before mapping begins. */
    beforeMap?: MappingHook<TSource, TDest> = null;

    destType?: { new(...args: any[]): TDest } = null;
}