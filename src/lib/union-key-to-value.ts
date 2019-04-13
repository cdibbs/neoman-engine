export type UnionKeyToValue<U extends string> = {
  [K in U]: K
};