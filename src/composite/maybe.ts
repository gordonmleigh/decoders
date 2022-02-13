import { Decoder } from '../core/Decoder.js';
import { ok, Result } from '../core/Result.js';

/**
 * Wraps another decoder to permit an empty string, `null`, or `undefined` in
 * addition to the types decoded by the wrapped decoder. If the input value or
 * the decoded value from the wrapped decoder is an empty string, `null`, or
 * `undefined`, then the decoder will return a value of `undefined`.
 *
 * @param decoder The decoder which will decode non-empty values
 *
 * @template Out The output value type of the wrapped decoder
 * @template In The input value type of the wrapped decoder
 *
 * @returns A new decoder which can decode an empty string, `null` or
 * `undefined`, as well as anything that the wrapped decoder can decode.
 *
 * @example
 *
 * ```typescript
 * const decoder = maybe(string);
 *
 * const result1 = decoder(''); // will be { ok: true, value: undefined }
 * const result2 = decoder(null); // will be { ok: true, value: undefined }
 * const result3 = decoder(undefined); // will be { ok: true, value: undefined }
 * const result4 = decoder('hello'); // will be { ok: true, value: 'hello' }
 * const result5 = decoder(42); // will be { ok: false, error: [...] }
 * ```
 */
export function maybe<Out, In>(
  decoder: Decoder<Out, In>,
): Decoder<Out | undefined, In> {
  return (value, opts) =>
    isEmpty(value) ? ok(undefined) : normalise(decoder(value, opts));
}

/**
 * @hidden
 */
function isEmpty(value: unknown): boolean {
  return value === '' || value === null || typeof value === 'undefined';
}

/**
 * @hidden
 */
function normalise<T>(result: Result<T>): Result<T | undefined> {
  if (result.ok && isEmpty(result.value)) {
    return ok(undefined);
  }
  return result;
}
