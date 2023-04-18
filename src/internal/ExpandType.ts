/**
 * Utility type which forces the compiler/IDE to evaluate the type.
 */
export type ExpandType<T> = T extends infer O
  ? { [K in keyof O]: O[K] }
  : never;
