export declare type MappingExceptionRule<TSource> = keyof TSource | ((src?: TSource) => any);
export declare type MappingExceptions<TSource, TDest> = {
    [key in keyof TDest]?: MappingExceptionRule<TSource>[];
} | {
    [key in keyof TDest]?: MappingExceptionRule<TSource>;
};
