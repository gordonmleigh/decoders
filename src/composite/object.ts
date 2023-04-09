import { Decoder } from '../core/Decoder.js';
import { DecoderError } from '../core/DecoderError.js';
import {
  combineDecoderOptions,
  DecoderOptions,
  DefaultDecoderOptions,
  ExtraFields,
  UndefinedFields,
} from '../core/DecoderOptions.js';
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
export interface IObjectDecoder<T> extends Decoder<T> {
  /**
   * Create another decoder instance with different options.
   */
  withOptions(options: DecoderOptions): IObjectDecoder<T>;
}

/**
 * Create a decoder which can decode an object.
 */
export function object<T>(
  props: PropDecoders<T>,
  defaultOptions?: DecoderOptions,
): ObjectDecoder<T> {
  return new ObjectDecoder(props, defaultOptions);
}

class ObjectDecoder<Out> implements Decoder<Out> {
  constructor(
    public readonly properties: PropDecoders<Out>,
    public readonly defaultOptions: DecoderOptions = {},
  ) {}

  public decode(value: unknown, optionOverrides?: DecoderOptions): Result<Out> {
    if (!isPlainObject(value)) {
      return invalid(ExpectedObject, 'expected object');
    }
    const opts = combineDecoderOptions(this.defaultOptions, optionOverrides);

    let anyErrors = false;
    const errors: DecoderError[] = [];
    const allKeys = Object.keys(Object.assign({}, value, this.properties));
    const outputValue: Record<string, unknown> = {};

    for (const key of allKeys) {
      if (key in this.properties) {
        // property is in validator definition
        const decoder = this.properties[key as keyof Out];
        const propResult = decoder.decode(
          (value as Record<string, unknown>)[key],
          opts,
        );

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
      return ok(outputValue as Out);
    }
  }

  /**
   * Create another decoder instance with different options.
   */
  public withOptions(options: DecoderOptions): ObjectDecoder<Out> {
    return new ObjectDecoder(
      this.properties,
      combineDecoderOptions(this.defaultOptions, options),
    );
  }
}
