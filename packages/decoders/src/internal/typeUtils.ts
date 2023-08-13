/**
 * Utility type which forces the compiler/IDE to evaluate the type.
 */
export type ExpandType<T> = T extends infer O
  ? { [K in keyof O]: O[K] }
  : never;

/**
 * Convert a union type to an intersection.
 */
// this works because args types are contravariant, leading to an intersection
export type UnionToIntersection<Union> = (
  Union extends any ? (arg: Union) => void : never
) extends (arg: infer Intersection) => void
  ? Intersection
  : never;

/**
 * Get the type of the property values in the object.
 */
export type ValuesOf<T> = T extends Record<any, infer V> ? V : never;
