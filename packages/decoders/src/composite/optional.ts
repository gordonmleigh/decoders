import { Decoder } from '../core/Decoder.js';
import { is } from '../predicates/is.js';
import { choose } from './choose.js';

/**
 * Creates a decoder which can decode `undefined` or pass through to the given
 * decoder.
 *
 * @param decoder The decoder to process non-undefined values.
 *
 * @example
 *
 * ```typescript
 * const decoder = optional(string);
 *
 * const result1 = decoder(undefined); // = { ok: true, value: undefined }
 * const result2 = decoder('hello'); // = { ok: true, value: 'hello' }
 * const result3 = decoder(12); // = { ok: false, error: [ ... ] }
 * ```
 *
 * @group Composite
 */
export function optional<Out, In>(
  decoder: Decoder<Out, In>,
): Decoder<Out | undefined, In> {
  return choose(is(undefined), decoder);
}
