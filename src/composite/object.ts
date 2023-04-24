import { Decoder, OptionsType, OutputType } from '../core/Decoder.js';
import { DecoderError } from '../core/DecoderError.js';
import { Result, error, invalid, ok } from '../core/Result.js';
import { isPlainObject } from '../internal/isPlainObject.js';
import { stripUndefined } from '../internal/stripUndefined.js';
import { UnionToIntersection, ValuesOf } from '../internal/typeUtils.js';

/**
 * Specifies the action to take when a field is encountered that has no
 * corresponding decoder.
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
 */
export type PropDecoders<T> = {
  [K in keyof T]-?: Decoder<T[K], any, any, any>;
};

export interface ObjectErrorBase<Out> extends DecoderError<'composite:object'> {
  properties?: {
    [K in keyof Out]?: DecoderError;
  };
}

export interface ObjectError<Props extends PropDecoders<any>>
  extends DecoderError<'composite:object'> {
  properties?: {
    [K in keyof Props]?: Props[K] extends Decoder<any, any, infer Err>
      ? Err
      : never;
  };
}

export type ObjectPropsOptions<Props extends PropDecoders<any>> =
  ObjectDecoderOptions &
    UnionToIntersection<Exclude<OptionsType<ValuesOf<Props>>, void>>;

export type ObjectType<Props extends PropDecoders<any>> = {
  [K in keyof Props]: OutputType<Props[K]>;
};

export type ObjectDecoderType<Props extends PropDecoders<any>> = Decoder<
  ObjectType<Props>,
  unknown,
  ObjectError<Props>,
  ObjectPropsOptions<Props>
>;

export interface ObjectDecoderFactory<Out> {
  schema<Props extends PropDecoders<Out>>(
    props: Props,
    defaultOptions?: ObjectPropsOptions<Props>,
  ): ObjectDecoderType<Props>;
}

/**
 * Create a decoder which can decode an object.
 */
export function object<Props extends PropDecoders<any>>(
  props: Props,
  defaultOptions?: ObjectPropsOptions<Props>,
): ObjectDecoderType<Props> {
  return ObjectDecoder.schema(props, defaultOptions);
}

/**
 * Helper function to allow the output type to be constrained and the error type
 * inferred.
 */
export function objectType<Out>(): ObjectDecoderFactory<Out> {
  return ObjectDecoder as ObjectDecoderFactory<Out>;
}

class ObjectDecoder<Props extends PropDecoders<any>>
  implements ObjectDecoderType<Props>
{
  public static readonly schema = <Props extends PropDecoders<any>>(
    props: Props,
    defaultOptions?: ObjectPropsOptions<Props>,
  ): ObjectDecoderType<Props> => {
    return new this(props, defaultOptions) as any;
  };

  constructor(
    public readonly properties: Props,
    public readonly defaultOptions: ObjectPropsOptions<Props> = {} as any,
  ) {}

  public decode(
    value: unknown,
    optionOverrides?: ObjectPropsOptions<Props>,
  ): Result<ObjectType<Props>, ObjectError<Props>> {
    if (!isPlainObject(value)) {
      return invalid('composite:object', 'expected object');
    }
    const opts = optionOverrides
      ? {
          ...this.defaultOptions,
          ...stripUndefined(optionOverrides),
        }
      : this.defaultOptions;

    let anyErrors = false;
    const errors = {} as Record<keyof Props, DecoderError>;
    const allKeys = Object.keys(Object.assign({}, value, this.properties));
    const outputValue: Record<string, unknown> = {};

    for (const key of allKeys) {
      if (key in this.properties) {
        // property is in validator definition
        const decoder = this.properties[key as keyof Props];
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
        // property is not in validator definition
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
  }
}
