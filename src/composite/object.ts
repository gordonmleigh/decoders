import { Decoder, OutputType } from '../core/Decoder.js';
import { DecoderError } from '../core/DecoderError.js';
import {
  DecoderOptions,
  DefaultDecoderOptions,
  ExtraFields,
  UndefinedFields,
  combineDecoderOptions,
} from '../core/DecoderOptions.js';
import { Result, error, invalid, ok } from '../core/Result.js';
import { ExpandType } from '../internal/ExpandType.js';
import { isPlainObject } from '../internal/isPlainObject.js';

/**
 * Defines a map of decoders for each property of a given type.
 */
export type PropDecoders<T> = { [K in keyof T]-?: Decoder<T[K]> };

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

export type ObjectType<Props extends PropDecoders<any>> = {
  [K in keyof Props]: OutputType<Props[K]>;
};

export interface ObjectDecoder<
  Out,
  Err extends ObjectErrorBase<Out> = ObjectErrorBase<Out>,
> extends Decoder<Out, unknown, Err> {
  withOptions(options: DecoderOptions): ObjectDecoder<Out, Err>;
}

export interface ObjectDecoderFactory<Out> {
  schema<Props extends PropDecoders<Out>>(
    props: Props,
    defaultOptions?: DecoderOptions,
  ): ObjectDecoder<Out, ExpandType<ObjectError<Props>>>;
}

/**
 * Create a decoder which can decode an object.
 */
export function object<Props extends PropDecoders<any>>(
  props: Props,
  defaultOptions?: DecoderOptions,
): ObjectDecoder<
  ExpandType<ObjectType<Props>>,
  ExpandType<ObjectError<Props>>
> {
  return ObjectDecoderImpl.schema(props, defaultOptions);
}

/**
 * Helper function to allow the output type to be constrained and the error type
 * inferred.
 */
export function objectType<Out>(): ObjectDecoderFactory<Out> {
  return ObjectDecoderImpl as ObjectDecoderFactory<Out>;
}

class ObjectDecoderImpl<Props extends PropDecoders<any>>
  implements ObjectDecoder<ObjectType<Props>, ObjectError<Props>>
{
  public static readonly schema = <Props extends PropDecoders<any>>(
    props: Props,
    defaultOptions?: DecoderOptions,
  ): ObjectDecoder<
    ExpandType<ObjectType<Props>>,
    ExpandType<ObjectError<Props>>
  > => {
    return new this(props, defaultOptions) as any;
  };

  constructor(
    public readonly properties: Props,
    public readonly defaultOptions: DecoderOptions = {},
  ) {}

  public decode(
    value: unknown,
    optionOverrides?: DecoderOptions,
  ): Result<ObjectType<Props>, ObjectError<Props>> {
    if (!isPlainObject(value)) {
      return invalid('composite:object', 'expected object');
    }
    const opts = combineDecoderOptions(this.defaultOptions, optionOverrides);

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
            errors[key as keyof Props] = {
              type: 'invalid',
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

  /**
   * Create another decoder instance with different options.
   */
  public withOptions(options: DecoderOptions): ObjectDecoderImpl<Props> {
    return new ObjectDecoderImpl<Props>(
      this.properties,
      combineDecoderOptions(this.defaultOptions, options),
    );
  }
}
