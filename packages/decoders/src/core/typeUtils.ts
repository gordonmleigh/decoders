/**
 * Convert a union type to an intersection.
 *
 * @remarks
 * This works because argument types are contravariant, leading to an
 * intersection.
 *
 * @group Types
 */
export type UnionToIntersection<Union> = (
  Union extends any ? (arg: Union) => void : never
) extends (arg: infer Intersection) => void
  ? Intersection
  : never;

/**
 * Get the type of the property values in the object.
 *
 * @group Types
 */
export type ValuesOf<T> = T extends Record<any, infer V> ? V : never;
