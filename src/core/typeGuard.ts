import { Decoder } from './Decoder.js';

/**
 * Represents a type guard function.
 */
export interface TypeGuard<T> {
  (value: unknown): value is T;
}

/**
 * Create a type guard from a [[Decoder]].
 *
 * @param decoder The decoder to use to perform the type check.
 */
export function typeGuard<Out>(decoder: Decoder<Out, unknown>): TypeGuard<Out> {
  return (value: unknown): value is Out => decoder.decode(value).ok;
}
