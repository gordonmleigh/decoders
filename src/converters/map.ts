import { Decoder } from '../core/Decoder.js';
import { ok } from '../core/Result.js';

/**
 * Create a decoder which maps its input to another value.
 *
 * @param map A function to map the input value to an output value.
 *
 * @example
 *
 * ```typescript
 * const trim = map((value: string) => value.trim());
 * ```
 */
export function map<T, V>(map: (value: T) => V): Decoder<V, T> {
  return (value) => ok(map(value));
}
