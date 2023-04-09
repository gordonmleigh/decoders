import { Decoder } from '../core/Decoder.js';
import { is } from '../predicates/is.js';
import { choose } from './choose.js';

/**
 * Creates a decoder which can decode `null` or pass through to the given
 * decoder.
 *
 * @param decoder The decoder to process non-null values.
 *
 * @example
 *
 * ```typescript
 * const decoder = nullable(string);
 *
 * const result1 = decoder(null); // = { ok: true, value: null }
 * const result2 = decoder('hello'); // = { ok: true, value: 'hello' }
 * const result3 = decoder(12); // = { ok: false, error: [ ... ] }
 * ```
 */
export function nullable<Out, In>(
  decoder: Decoder<Out, In>,
): Decoder<Out | null, In> {
  return choose(is(null), decoder);
}
