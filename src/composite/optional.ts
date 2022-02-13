import { Decoder } from '../core/Decoder.js';
import { ok } from '../core/Result.js';

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
 */
export function optional<Out, In>(
  decoder: Decoder<Out, In>,
): Decoder<Out | undefined, In> {
  return (value, opts) =>
    typeof value === 'undefined' ? ok(value) : decoder(value, opts);
}
