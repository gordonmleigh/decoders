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
export function array<T>(element: Decoder<T>): Decoder<T[]> {
  return new ArrayDecoder(element);
}

class ArrayDecoder<Element> implements Decoder<Element[]> {
  constructor(public readonly element: Decoder<Element>) {}

  public decode(value: unknown, opts?: DecoderOptions): Result<Element[]> {
    if (!Array.isArray(value)) {
      return invalid(ExpectedArray, 'expected array');
    }

    const decoded: Element[] = [];
    const errors: DecoderError[] = [];
    let anyErrors = false;

    for (let i = 0; i < value.length; ++i) {
      const elemResult = this.element.decode(value[i], opts);
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
  }
}
