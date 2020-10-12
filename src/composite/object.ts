import { Decoder } from '../core/Decoder';
import { error, invalid, ok, Result } from '../core/Result';
import { DecoderError } from "../core/DecoderError";

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
export type PropDecoders<T> = { [K in keyof T]: Decoder<T[K]> };

/**
 * Specifies the action to take for an [[ObjectDecoder]] when a field is
 * encountered that has no corresponding decoder.
 */
export enum ExtraFields {
  /**
   * Silently drop the field.
   */
  Ignore,

  /**
   * Include the field and its value verbatim.
   */
  Include,

  /**
   * Return a error result.
   */
  Reject,
}

/**
 * Options to control decoding of an object.
 */
export interface ObjectDecoderOptions {
  /**
   * Specifies the action to take for an [[ObjectDecoder]] when a field is
   * encountered that has no corresponding decoder.
   */
  extraFields?: ExtraFields;
}

/**
 * Represents a factory function that can create a decoder from a decoder map.
 */
export interface ObjectDecoderFactory {
  /**
   * Create a decoder that can decode an object.
   */
  <T>(props: PropDecoders<T>): Decoder<T>;
}

/**
 * Represents the type of [[object]].
 */
export interface ObjectDecoder extends ObjectDecoderFactory {
  /**
   * Create an [[ObjectDecoderFactory]] with the given options.
   *
   * @param opts The options to control the decoding operation.
   */
  options(opts: ObjectDecoderOptions): ObjectDecoderFactory;

  /**
   * Create an [[ObjectDecoderFactory]] that will create a decoder that passes
   * through fields with no matching decoder. Equivalent to calling
   * [[ObjectDecoder.options]] with a `extraFields` set to
   * [[ExtraFields.Include]].
   */
  partial: ObjectDecoderFactory;

  /**
   * Create an [[ObjectDecoderFactory]] that will create a decoder that rejects
   * fields with no matching decoder. Equivalent to calling
   * [[ObjectDecoder.options]] with a `extraFields` set to
   * [[ExtraFields.Reject]].
   */
  strict: ObjectDecoderFactory;
}

/**
 * Create a decoder which can decode an object.
 */
export const object: ObjectDecoder = Object.assign(objectOptions(), {
  options: objectOptions,
  partial: objectOptions({ extraFields: ExtraFields.Include }),
  strict: objectOptions({ extraFields: ExtraFields.Reject }),
});

/**
 * @hidden
 */
function objectOptions({
  extraFields = ExtraFields.Ignore,
}: ObjectDecoderOptions = {}): ObjectDecoderFactory {
  return <T>(props: PropDecoders<T>) => (value: unknown): Result<T> => {
    if (typeof value !== 'object' || value === null) {
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

        const propResult = decoder((value as Record<string, unknown>)[key]);

        if (!propResult.ok) {
          anyErrors = true;
          errors.push(
            ...propResult.error.map((x) => ({
              ...x,
              field: joinIds(key, x.field),
            })),
          );
        } else {
          outputValue[key] = propResult.value;
        }
      } else {
        // property is not in validator definition
        switch (extraFields) {
          case ExtraFields.Reject:
            anyErrors = true;
            errors.push({
              id: UnexpectedField,
              text: 'unexpected value',
              field: key,
            });
            break;

          case ExtraFields.Ignore:
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
  };
}

function joinIds(...ids: (string | undefined)[]): string {
  return ids.filter(Boolean).join('.');
}
