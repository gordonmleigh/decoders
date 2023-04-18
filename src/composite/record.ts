import { Decoder, ErrorType, OutputType } from '../core/Decoder.js';
import { DecoderError } from '../core/DecoderError.js';
import { DecoderOptions } from '../core/DecoderOptions.js';
import { Result, error, ok } from '../core/Result.js';
import { isPlainObject } from '../internal/isPlainObject.js';

export type RecordDecoderError<
  Key extends PropertyKey = PropertyKey,
  KeyError extends DecoderError = DecoderError,
  ValueError extends DecoderError = DecoderError,
> = DecoderError<'composite:record'> & {
  keys?: Record<Key, KeyError>;
  values?: Record<Key, ValueError>;
};

type RecordErrorTypeFor<
  Key extends Decoder<PropertyKey>,
  Value extends Decoder<any>,
> = RecordDecoderError<OutputType<Key>, ErrorType<Key>, ErrorType<Value>>;

type RecordDecoderType<
  Key extends Decoder<PropertyKey>,
  Value extends Decoder<any>,
> = Decoder<
  Record<OutputType<Key>, OutputType<Value>>,
  unknown,
  RecordErrorTypeFor<Key, Value>
>;

/**
 * Create a [[Decoder]] to decode a record.
 *
 * @param decodeKey decoder to decode keys
 * @param decodeValue decoder to decode values
 */
export function record<
  Key extends Decoder<PropertyKey>,
  Value extends Decoder<any>,
>(decodeKey: Key, decodeValue: Value): RecordDecoderType<Key, Value> {
  return new RecordDecoder(decodeKey, decodeValue);
}

class RecordDecoder<
  Key extends Decoder<PropertyKey>,
  Value extends Decoder<any>,
> implements RecordDecoderType<Key, Value>
{
  constructor(public readonly key: Key, public readonly value: Value) {}

  public decode(
    value: unknown,
    opts?: DecoderOptions,
  ): Result<
    Record<OutputType<Key>, OutputType<Value>>,
    RecordErrorTypeFor<Key, Value>
  > {
    if (!isPlainObject(value)) {
      return error({
        type: 'composite:record',
        text: 'expected record',
      });
    }

    let anyErrors = false;
    const keyErrors: any = {};
    const valueErrors: any = {};
    const outputValue: any = {};

    for (const [k, v] of Object.entries(value)) {
      const keyResult = this.key.decode(k, opts);
      if (!keyResult.ok) {
        anyErrors = true;
        keyErrors[k] = keyResult.error;
      }

      let decodedValue = v;

      const valueResult = this.value.decode(v, opts);
      if (!valueResult.ok) {
        anyErrors = true;
        valueErrors[k] = valueResult.error;
      } else {
        decodedValue = valueResult.value;
      }

      if (!anyErrors) {
        outputValue[k] = decodedValue;
      }
    }

    if (anyErrors) {
      return error({
        type: 'composite:record',
        text: 'invalid keys or values',
        keys: keyErrors,
        values: valueErrors,
      });
    } else {
      return ok(outputValue);
    }
  }
}
