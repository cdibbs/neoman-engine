import { MappingExceptions } from './mapping-exceptions';
export type MappingHook<TSource, TDest>
    = (src?: TSource, dest?: TDest, profile?: MapperProfile<TSource, TDest>)
        => TDest | void;

export class MapperProfile<TSource, TDest> {
    exceptions?: MappingExceptions<TSource, TDest> = null;

    afterMap?: MappingHook<TSource, TDest> = null;

    beforeMap?: MappingHook<TSource, TDest> = null;

    destType?: { new(...args: any[]): TDest } = null;
}