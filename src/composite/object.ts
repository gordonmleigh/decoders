import { Decoder } from '../core/Decoder.js';
import { DecoderError } from '../core/DecoderError.js';
import {
  combineDecoderOptions,
  DecoderOptions,
  DefaultDecoderOptions,
  ExtraFields,
  UndefinedFields,
} from '../core/DecoderOptions';
import { error, invalid, ok, Result } from '../core/Result.js';
import { isPlainObject } from '../internal/isPlainObject.js';
import { joinIds } from '../internal/joinIds.js';

/**
 * Error identifier returned by [[ObjectDecoder]] when the given value is not an
 * object.
 */
export const ExpectedObject = 'EXPECTED_OBJECT';

/**
 * Error identifier returned by [[ObjectDecoder]] when the given value has
 * unexpected fields.
 */
export const UnexpectedField = 'UNEXPECTED_FIELD';

/**
 * Defines a map of decoders for each property of a given type.
 */
export type PropDecoders<T> = { [K in keyof T]-?: Decoder<T[K]> };

/**
 * Represents a function which can decode an object value.
 *
 * @template T The output value type.
 */
export interface ObjectDecoder<T> extends Decoder<T> {
  /**
   * Create another decoder instance with different options.
   */
  withOptions(options: DecoderOptions): ObjectDecoder<T>;
}

/**
 * Create a decoder which can decode an object.
 */
export function object<T>(
  props: PropDecoders<T>,
  baseOptions?: DecoderOptions,
): ObjectDecoder<T> {
  function decode(value: unknown, opts?: DecoderOptions): Result<T> {
    return doObjectDecode(
      props,
      value,
      combineDecoderOptions(baseOptions, opts),
    );
  }

  const decoder = decode as ObjectDecoder<T>;

  decoder.withOptions = (newOpts: DecoderOptions): ObjectDecoder<T> => {
    return object(props, combineDecoderOptions(baseOptions, newOpts));
  };

  return decoder;
}

/**
 * @hidden
 */
function doObjectDecode<T>(
  props: PropDecoders<T>,
  value: unknown,
  opts?: DecoderOptions,
): Result<T> {
  if (!isPlainObject(value)) {
    return invalid(ExpectedObject, 'expected object');
  }

  let anyErrors = false;
  const errors: DecoderError[] = [];
  const allKeys = Object.keys(Object.assign({}, value, props));
  const outputValue: Record<string, unknown> = {};

  for (const key of allKeys) {
    if (key in props) {
      // property is in validator definition
      const decoder = props[key as keyof T];
      const propResult = decoder((value as Record<string, unknown>)[key], opts);

      if (!propResult.ok) {
        anyErrors = true;
        errors.push(
          ...propResult.error.map((x) => ({
            ...x,
            field: joinIds(key, x.field),
          })),
        );
      } else if (propResult.value === undefined) {
        switch (
          opts?.undefinedFields ??
          DefaultDecoderOptions.undefinedFields
        ) {
          case UndefinedFields.Explicit:
            outputValue[key] = propResult.value;
            break;

          case UndefinedFields.FromInput:
            if (key in value) {
              outputValue[key] = propResult.value;
            }
            break;
        }
      } else {
        outputValue[key] = propResult.value;
      }
    } else {
      // property is not in validator definition
      switch (opts?.extraFields ?? DefaultDecoderOptions.extraFields) {
        case ExtraFields.Reject:
          anyErrors = true;
          errors.push({
            id: UnexpectedField,
            text: 'unexpected value',
            field: key,
          });
          break;

        case ExtraFields.Include:
          outputValue[key] = (value as Record<string, unknown>)[key];
          break;
      }
    }
  }

  if (anyErrors || errors.length) {
    return error(errors);
  } else {
    return ok(outputValue as T);
  }
}
