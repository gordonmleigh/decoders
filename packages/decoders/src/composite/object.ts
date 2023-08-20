import { Decoder, OptionsType, OutputType, decoder } from '../core/Decoder.js';
import { DecoderError } from '../core/DecoderError.js';
import { error, invalid, ok } from '../core/Result.js';
import { combineOptions } from '../core/combineOptions.js';
import { UnionToIntersection, ValuesOf } from '../core/typeUtils.js';
import { Schema } from '../internal/Schema.js';
import { isPlainObject } from '../internal/isPlainObject.js';

/**
 * Specifies the action to take when a field is encountered that has no
 * corresponding decoder.
 *
 * @group Types
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
 * Specifies the action to take for an when a decoder for a field returns
 * undefined.
 *
 * @group Types
 */
export enum UndefinedFields {
  /**
   * Keep if present in input.
   */
  FromInput,

  /**
   * Set undefined explicitly even if not present in input.
   */
  Explicit,

  /**
   * Remove undefined fields.
   */
  Strip,
}

/**
 * Options to control decoding of a value.
 *
 * @group Types
 */
export interface ObjectDecoderOptions {
  /**
   * Specifies the action to take when a field is encountered that has no
   * corresponding decoder.
   */
  extraFields?: ExtraFields;

  /**
   * Specifies the action to take for an when a decoder for a field returns
   * undefined.
   */
  undefinedFields?: UndefinedFields;
}

/**
 * Defines a map of decoders for each property of a given type.
 *
 * @group Types
 */
export type PropDecoders<T> = {
  [K in keyof T]-?: Decoder<T[K], any, any, any>;
};

/**
 * The error returned when a {@link object} {@link Decoder} fails.
 *
 * @group Types
 */
export interface ObjectError<Props extends PropDecoders<any>>
  extends DecoderError<'composite:object'> {
  properties?: {
    [K in keyof Props]?: Props[K] extends Decoder<any, any, infer Err>
      ? Err
      : never;
  };
}

/**
 * The combined options type for a {@link object} {@link Decoder}.
 *
 * @group Types
 */
export type ObjectPropsOptions<Props extends PropDecoders<any>> =
  ObjectDecoderOptions &
    UnionToIntersection<Exclude<OptionsType<ValuesOf<Props>>, void>>;

/**
 * The output type for the given props type.
 *
 * @group Types
 */
export type ObjectType<Props extends PropDecoders<any>> = {
  [K in keyof Props]: OutputType<Props[K]>;
};

/**
 * The specific {@link Decoder} type for an object with given props.
 *
 * @group Types
 */
export type ObjectDecoderType<Props extends PropDecoders<any>> = Decoder<
  ObjectType<Props>,
  unknown,
  ObjectError<Props>,
  ObjectPropsOptions<Props>
>;

/**
 * An object to create a {@link object} decoder with constrained output type.
 *
 * @group Types
 */
export interface ObjectDecoderFactory<Out> {
  schema<Props extends PropDecoders<Out>>(
    props: Props,
    defaultOptions?: ObjectPropsOptions<Props>,
  ): ObjectDecoderType<Props>;
}

/**
 * Create a decoder which can decode an object.
 *
 * @group Composite
 */
export function object<Props extends PropDecoders<any>>(
  props: Props,
  defaultOptions?: ObjectPropsOptions<Props>,
): ObjectDecoderType<Props> {
  return decoder((value, optionOverrides) => {
    if (!isPlainObject(value)) {
      return invalid('composite:object', 'expected object');
    }
    const opts = combineOptions(defaultOptions, optionOverrides);

    let anyErrors = false;
    const errors = {} as Record<keyof Props, DecoderError>;
    const allKeys = Object.keys(Object.assign({}, value, props));
    const outputValue: Record<string, unknown> = {};

    for (const key of allKeys) {
      if (key in props) {
        // property is in decoder definition
        const decoder = props[key as keyof Props];
        const propResult = decoder.decode(
          (value as Record<string, unknown>)[key],
          opts,
        );

        if (!propResult.ok) {
          anyErrors = true;
          errors[key as keyof Props] = propResult.error;
        } else if (propResult.value === undefined) {
          switch (opts?.undefinedFields) {
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
        // property is not in decoder definition
        switch (opts?.extraFields) {
          case ExtraFields.Reject:
            anyErrors = true;
            errors[key as keyof Props] = {
              type: 'value:invalid',
              text: 'unexpected property',
            };
            break;

          case ExtraFields.Include:
            outputValue[key] = (value as Record<string, unknown>)[key];
            break;
        }
      }
    }

    if (anyErrors) {
      return error({
        type: 'composite:object',
        text: 'invalid properties',
        properties: errors as any,
      });
    } else {
      return ok(outputValue as ObjectType<Props>);
    }
  });
}

/**
 * Helper function to allow the output type to be constrained and the error and
 * options types inferred.
 *
 * @group Composite
 */
export function objectType<Out>(): ObjectDecoderFactory<Out> {
  return new Schema(object);
}
