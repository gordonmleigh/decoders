import { Decoder } from '../core/Decoder.js';
import { DecoderError } from '../core/DecoderError.js';
import { DecoderOptions } from '../core/DecoderOptions.js';
import { invalid, ok, Result } from '../core/Result.js';
import { joinIds } from '../internal/joinIds.js';

/**
 * Error identifier returned when [[array]] fails.
 */
export const ExpectedArray = 'EXPECTED_ARRAY';

/**
 * Create a [[Decoder]] which can decode an array, using the given [[Decoder]]
 * to decode each element.
 *
 * @param elem The [[Decoder]] to use to decode the elements.
 */
export function array<T>(elem: Decoder<T>): Decoder<T[]> {
  return {
    decode: (value: unknown, opts?: DecoderOptions): Result<T[]> => {
      if (!Array.isArray(value)) {
        return invalid(ExpectedArray, 'expected array');
      }

      const decoded: T[] = [];
      const errors: DecoderError[] = [];
      let anyErrors = false;

      for (let i = 0; i < value.length; ++i) {
        const elemResult = elem.decode(value[i], opts);
        if (elemResult.ok) {
          decoded[i] = elemResult.value;
        } else {
          errors.push(
            ...elemResult.error.map((x) => ({
              ...x,
              field: joinIds(i.toString(), x.field),
            })),
          );
          anyErrors = true;
        }
      }

      if (anyErrors) {
        return { ok: false, error: errors };
      }
      return ok(decoded);
    },
  };
}
