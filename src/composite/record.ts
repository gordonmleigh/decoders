import { Decoder, ErrorType, OutputType } from '../core/Decoder.js';
import { DecoderError } from '../core/DecoderError.js';
import { DecoderValidator, validator } from '../core/DecoderValidator.js';
import { error, ok } from '../core/Result.js';
import { isPlainObject } from '../internal/isPlainObject.js';

/**
 * The error returned when a {@link record} decoder fails.
 */
export type RecordDecoderError<
  Key extends PropertyKey = PropertyKey,
  KeyError extends DecoderError = DecoderError,
  ValueError extends DecoderError = DecoderError,
> = DecoderError<'composite:record'> & {
  keys?: Record<Key, KeyError>;
  values?: Record<Key, ValueError>;
};

/**
 * The error type for a {@link record} decoder with the given key and value
 * decoders.
 */
type RecordErrorTypeFor<
  Key extends Decoder<PropertyKey>,
  Value extends Decoder<any>,
> = RecordDecoderError<OutputType<Key>, ErrorType<Key>, ErrorType<Value>>;

/**
 * The specific {@link DecoderValidator} type for a {@link record} decoder.
 */
type RecordDecoderType<
  Key extends Decoder<PropertyKey>,
  Value extends Decoder<any>,
> = DecoderValidator<
  Record<OutputType<Key>, OutputType<Value>>,
  unknown,
  RecordErrorTypeFor<Key, Value>
>;

/**
 * Create a {@link DecoderValidator} to decode a record.
 *
 * @param keyDecoder decoder to decode keys
 * @param valueDecoder decoder to decode values
 */
export function record<
  Key extends Decoder<PropertyKey>,
  Value extends Decoder<any>,
>(keyDecoder: Key, valueDecoder: Value): RecordDecoderType<Key, Value> {
  return validator((value, opts) => {
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
      const keyResult = keyDecoder.decode(k, opts);
      if (!keyResult.ok) {
        anyErrors = true;
        keyErrors[k] = keyResult.error;
      }

      let decodedValue = v;

      const valueResult = valueDecoder.decode(v, opts);
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
  });
}
