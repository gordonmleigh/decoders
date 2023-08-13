import { DecoderError } from './DecoderError.js';
import { DecodingAssertError } from './DecodingAssertError.js';
import { Result, ok } from './Result.js';
import { combineOptions } from './combineOptions.js';

/**
 * Represents an object which can decode a value.
 *
 * @template Out The output value type.
 * @template In The input value type.
 */
export interface Decoder<
  Out,
  In = unknown,
  Err extends DecoderError = DecoderError,
  Opts = void,
> {
  /**
   * Apply another decoder function after this decoder runs.
   */
  and<NewOut, NewErr extends DecoderError, NewOpts>(
    decoder:
      | DecoderFunction<NewOut, Out, NewErr, NewOpts>
      | Decoder<NewOut, Out, NewErr, NewOpts>,
  ): Decoder<NewOut, In, Err | NewErr, Opts & NewOpts>;

  /**
   * Decode a value, or throw an error on failure.
   *
   * @param value The input value
   * @param opts The options for the decoder
   * @returns The decoded value
   */
  assert(value: In, opts?: Opts): Out;

  /**
   * Decode a value, possibly validating or transforming it.
   *
   * @param value The input value
   * @param opts The options for the decoder
   * @returns A {@link Result} instance
   */
  decode(value: In, opts?: Opts): Result<Out, Err>;

  /**
   * Returns a decoder which can accept `undefined` or pass to the current
   * decoder.
   */
  optional(): Decoder<Out | undefined, In | undefined, Err, Opts>;

  /**
   * Returns true if the given value is decodable by this decoder.
   */
  test(value: unknown, opts?: Opts): value is Out;

  /**
   * Transform the output to a different value.
   */
  transform<NewOut>(
    apply: (value: Out) => NewOut,
  ): Decoder<NewOut, In, Err, Opts>;

  /**
   * Return a new decoder that returns the given error on failure instead of the
   * default one.
   */
  withError<ErrType extends string>(
    error: ErrType,
    text: string,
  ): Decoder<Out, In, DecoderError<ErrType>, Opts>;
  /**
   * Return a new decoder that returns the given error on failure instead of the
   * default one.
   */
  withError<ErrType extends string, Meta>(
    error: ErrType,
    text: string,
    meta: Meta,
  ): Decoder<Out, In, DecoderError<ErrType> & Meta, Opts>;
  /**
   * Return a new decoder that returns the given error on failure instead of the
   * default one.
   */
  withError<MappedErr extends DecoderError>(
    error: MappedErr,
  ): Decoder<Out, In, MappedErr, Opts>;
  /**
   * Return a new decoder that returns the given error on failure instead of the
   * default one.
   */
  withError<MappedErr extends DecoderError>(
    error: (err: Err) => MappedErr,
  ): Decoder<Out, In, MappedErr, Opts>;

  /**
   * Return a new decoder with the given options.
   */
  withOptions(opts: Opts): Decoder<Out, In, Err, Opts>;
}

/**
 * Determine the input type of the decoder.
 */
export type InputType<T> = T extends AnyDecoder<any, infer In> ? In : never;

/**
 * Determine the output type of the decoder.
 */
export type OutputType<T> = T extends AnyDecoder<infer Out, any> ? Out : never;

/**
 * Determine the error type of the decoder.
 */
export type ErrorType<T> = T extends AnyDecoder<any, any, infer Err>
  ? Err
  : never;

/**
 * Determine the options type of the decoder.
 */
export type OptionsType<T> = T extends AnyDecoder<any, any, any, infer Opts>
  ? Opts
  : never;

/**
 * Represents a {@link Decoder} with any parameters.
 */
export type AnyDecoder<
  Out = any,
  In = any,
  Err extends DecoderError = any,
  Opts = any,
> = Decoder<Out, In, Err, Opts>;

/**
 * Represents an array of {@link Decoder}s with any parameters.
 */
export type DecoderArray<
  Out = any,
  In = any,
  Err extends DecoderError = any,
  Opts = any,
> = Decoder<Out, In, Err, Opts>[];

/**
 * Represents a function that can decode a value.
 */
export type DecoderFunction<
  Out,
  In = unknown,
  Err extends DecoderError = DecoderError,
  Opts = unknown,
> = Decoder<Out, In, Err, Opts>['decode'];

/**
 * Create a custom {@link Decoder} from a {@link DecoderFunction}.
 */
export function decoder<
  Out,
  In = unknown,
  Err extends DecoderError = DecoderError,
  Opts = unknown,
>(decode: DecoderFunction<Out, In, Err, Opts>): Decoder<Out, In, Err, Opts> {
  return new DecoderLambda(decode);
}

/**
 * A base class for {@link Decoder} implementations.
 */
export abstract class DecoderBase<
  Out,
  In = unknown,
  Err extends DecoderError = DecoderError,
  Opts = void,
> implements Decoder<Out, In, Err, Opts>
{
  public abstract decode(value: In, opts?: Opts): Result<Out, Err>;

  public and<NewOut, NewErr extends DecoderError, NewOpts>(
    decoder:
      | DecoderFunction<NewOut, Out, NewErr, NewOpts>
      | Decoder<NewOut, Out, NewErr, NewOpts>,
  ): Decoder<NewOut, In, Err | NewErr, Opts & NewOpts> {
    return new DecoderLambda((value, opts): Result<NewOut, Err | NewErr> => {
      const result = this.decode(value, opts);
      if (!result.ok) {
        return result;
      }
      if (typeof decoder === 'function') {
        return decoder(result.value, opts);
      }
      return decoder.decode(result.value, opts);
    });
  }

  public assert(value: In, opts?: Opts): Out {
    const result = this.decode(value, opts);
    if (!result.ok) {
      throw new DecodingAssertError(result.error);
    }
    return result.value;
  }

  public optional(): Decoder<Out | undefined, In | undefined, Err, Opts> {
    return new DecoderLambda((value, opts) => {
      if (value === undefined) {
        return ok(undefined);
      }
      return this.decode(value, opts);
    });
  }

  public test(value: any, opts?: Opts): value is Out {
    try {
      return this.decode(value, opts).ok;
    } catch {
      // we swallow errors here in case the decode function relies on a specific
      // input type which we can't be sure we have here.
      return false;
    }
  }

  public transform<NewOut>(
    apply: (value: Out) => NewOut,
  ): Decoder<NewOut, In, Err, Opts> {
    return new DecoderLambda((value, opts) => {
      const result = this.decode(value, opts);
      if (!result.ok) {
        return result;
      }
      return ok(apply(result.value));
    });
  }

  public withError<ErrType extends string>(
    error: ErrType,
    text: string,
  ): Decoder<Out, In, DecoderError<ErrType>, Opts>;
  public withError<ErrType extends string, Meta>(
    error: ErrType,
    text: string,
    meta: Meta,
  ): Decoder<Out, In, DecoderError<ErrType> & Meta, Opts>;
  public withError<MappedErr extends DecoderError<string>>(
    error: MappedErr,
  ): Decoder<Out, In, MappedErr, Opts>;
  public withError<MappedErr extends DecoderError<string>>(
    error: (err: Err) => MappedErr,
  ): Decoder<Out, In, MappedErr, Opts>;
  public withError(
    error: string | DecoderError | ((err: Err) => DecoderError),
    text?: unknown,
    meta?: any,
  ): Decoder<Out, In, DecoderError, Opts> {
    let mapError: (err: Err) => DecoderError;
    if (typeof error === 'function') {
      mapError = error;
    } else if (typeof error === 'string') {
      mapError = (): any => ({
        type: error,
        text: text as string,
        ...meta,
      });
    } else {
      mapError = (): any => error;
    }

    return new DecoderLambda((value, opts) => {
      const result = this.decode(value, opts);
      if (!result.ok) {
        return { ok: false, error: mapError(result.error) };
      }
      return result;
    });
  }

  public withOptions(opts: Opts): Decoder<Out, In, Err, Opts> {
    return new DecoderLambda((value, optionOverrides) =>
      this.decode(value, combineOptions(opts, optionOverrides)),
    );
  }
}

class DecoderLambda<
  Out,
  In,
  Err extends DecoderError,
  Opts,
> extends DecoderBase<Out, In, Err, Opts> {
  constructor(private readonly _decode: DecoderFunction<Out, In, Err, Opts>) {
    super();
  }

  public override decode(value: In, opts?: Opts | undefined): Result<Out, Err> {
    return this._decode(value, opts);
  }

  public test(value: any, opts?: Opts | undefined): value is Out {
    return this.decode(value, opts).ok;
  }
}
