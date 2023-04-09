import { Decoder } from '../core/Decoder.js';
import { DecoderError } from '../core/DecoderError.js';
import { DecoderOptions } from '../core/DecoderOptions.js';
import { error, invalid, ok, Result } from '../core/Result.js';
import { isPlainObject } from '../internal/isPlainObject.js';
import { joinIds } from '../internal/joinIds.js';

/**
 * Error identifier returned when the given value is not a record.
 */
export const ExpectedRecord = 'EXPECTED_RECORD';

/**
 * Create a [[Decoder]] to decode a record.
 *
 * @param decodeKey decoder to decode keys
 * @param decodeValue decoder to decode values
 */
export function record<K extends keyof any, V>(
  decodeKey: Decoder<K>,
  decodeValue: Decoder<V>,
): Decoder<Record<K, V>> {
  return new RecordDecoder(decodeKey, decodeValue);
}

class RecordDecoder<K extends PropertyKey, V> implements Decoder<Record<K, V>> {
  constructor(
    public readonly key: Decoder<K>,
    public readonly value: Decoder<V>,
  ) {}

  public decode(value: unknown, opts?: DecoderOptions): Result<Record<K, V>> {
    if (!isPlainObject(value)) {
      return invalid(ExpectedRecord, 'expected record');
    }

    let anyErrors = false;
    const errors: DecoderError[] = [];
    const outputValue: Record<string, unknown> = {};

    for (const [k, v] of Object.entries(value)) {
      const keyResult = this.key.decode(k, opts);
      if (!keyResult.ok) {
        anyErrors = true;
        errors.push(
          ...keyResult.error.map((x) => ({
            ...x,
            field: '$key',
          })),
        );
      }

      let decodedValue = v;

      const valueResult = this.value.decode(v, opts);
      if (!valueResult.ok) {
        anyErrors = true;
        errors.push(
          ...valueResult.error.map((x) => ({
            ...x,
            field: joinIds(k, x.field),
          })),
        );
      } else {
        decodedValue = valueResult.value;
      }

      if (!anyErrors) {
        outputValue[k] = decodedValue;
      }
    }

    if (anyErrors || errors.length) {
      return error(errors);
    } else {
      return ok(outputValue as Record<K, V>);
    }
  }
}
