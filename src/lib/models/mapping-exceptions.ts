export enum MapOption {
    Ignore
};

export type MappingExceptionRule<TSource>
    = keyof TSource
    | ((src?: TSource) => any)
    | MapOption;

export type MappingExceptions<TSource, TDest>
    = { [ key in keyof TDest]?: MappingExceptionRule<TSource>[] }
    | { [ key in keyof TDest]?: MappingExceptionRule<TSource> };