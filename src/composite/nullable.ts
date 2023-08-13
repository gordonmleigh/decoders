import { Decoder } from '../core/Decoder.js';
import { DecoderError } from '../core/DecoderError.js';
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
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function nullable<Out, In, Err extends DecoderError>(
  decoder: Decoder<Out, In, Err>,
) {
  return choose(is(null), decoder);
}
