import { DecoderFunction } from './Decoder.js';
import { DecoderError } from './DecoderError.js';
import { DecodingAssertError } from './DecodingAssertError.js';
import { Result } from './Result.js';
import { combineOptions } from './combineOptions.js';

/**
 * Represents an object which can decode a value.
 *
 * @template Out The output value type.
 * @template In The input value type.
 */
export interface DecoderValidator<
  Out extends In,
  In = unknown,
  Err extends DecoderError = DecoderError,
  Opts = void,
> {
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
   * @returns [[OkResult]] on success or [[ErrorResult]] on failure.
   */
  decode(value: In, opts?: Opts): Result<Out, Err>;

  /**
   * Test if a value matches.
   *
   * @param value The value to test
   * @param opts The options for the decoder
   * @returns true if the value matches, false otherwise
   */
  test(value: In, opts?: Opts): value is Out;

  /**
   * Return a new decoder that returns the given error on failure instead of the
   * default one.
   */
  withError<ErrType extends string>(
    error: ErrType,
    text: string,
  ): DecoderValidator<Out, In, DecoderError<ErrType>, Opts>;
  /**
   * Return a new decoder that returns the given error on failure instead of the
   * default one.
   */
  withError<ErrType extends string, Meta>(
    error: ErrType,
    text: string,
    meta: Meta,
  ): DecoderValidator<Out, In, DecoderError<ErrType> & Meta, Opts>;
  /**
   * Return a new decoder that returns the given error on failure instead of the
   * default one.
   */
  withError<MappedErr extends DecoderError>(
    error: MappedErr,
  ): DecoderValidator<Out, In, MappedErr, Opts>;
  /**
   * Return a new decoder that returns the given error on failure instead of the
   * default one.
   */
  withError<MappedErr extends DecoderError>(
    error: (err: Err) => MappedErr,
  ): DecoderValidator<Out, In, MappedErr, Opts>;

  /**
   * Return a new decoder with the given options.
   */
  withOptions(opts: Opts): DecoderValidator<Out, In, Err, Opts>;
}

/**
 * Represents a {@link DecoderValidator} with any parameters.
 */
export type AnyDecoderValidator<
  Out extends In = any,
  In = any,
  Err extends DecoderError = any,
  Opts = any,
> = DecoderValidator<Out, In, Err, Opts>;

/**
 * Represents an array of {@link DecoderValidator}s with any parameters.
 */
export type DecoderValidatorArray<
  Out extends In = any,
  In = any,
  Err extends DecoderError = any,
  Opts = any,
> = DecoderValidator<Out, In, Err, Opts>[];

/**
 * Create a custom {@link DecoderValidator} from a {@link DecoderFunction}.
 */
export function validator<
  Out extends In,
  In = unknown,
  Err extends DecoderError = DecoderError,
  Opts = unknown,
>(
  decode: DecoderFunction<Out, In, Err, Opts>,
): DecoderValidator<Out, In, Err, Opts> {
  return new DecoderValidatorImpl(decode);
}

export abstract class DecoderValidatorBase<
  Out extends In,
  In,
  Err extends DecoderError,
  Opts,
> implements DecoderValidator<Out, In, Err, Opts>
{
  public abstract decode: DecoderFunction<Out, In, Err, Opts>;

  public assert(value: In, opts?: Opts): Out {
    const result = this.decode(value, opts);
    if (!result.ok) {
      throw new DecodingAssertError(result.error);
    }
    return result.value;
  }

  public test(value: In, opts?: Opts | undefined): value is Out {
    return this.decode(value, opts).ok;
  }

  public withError<ErrType extends string>(
    error: ErrType,
    text: string,
  ): DecoderValidator<Out, In, DecoderError<ErrType>, Opts>;
  public withError<ErrType extends string, Meta>(
    error: ErrType,
    text: string,
    meta: Meta,
  ): DecoderValidator<Out, In, DecoderError<ErrType> & Meta, Opts>;
  public withError<MappedErr extends DecoderError<string>>(
    error: MappedErr,
  ): DecoderValidator<Out, In, MappedErr, Opts>;
  public withError<MappedErr extends DecoderError<string>>(
    error: (err: Err) => MappedErr,
  ): DecoderValidator<Out, In, MappedErr, Opts>;
  public withError(
    error: string | DecoderError | ((err: Err) => DecoderError),
    text?: unknown,
    meta?: any,
  ): AnyDecoderValidator {
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

    return validator((value, opts) => {
      const result = this.decode(value, opts);
      if (!result.ok) {
        return { ok: false, error: mapError(result.error) };
      }
      return result;
    });
  }

  public withOptions(opts: Opts): DecoderValidator<Out, In, Err, Opts> {
    return validator((value, optionOverrides) =>
      this.decode(value, combineOptions(opts, optionOverrides)),
    );
  }
}

class DecoderValidatorImpl<
  Out extends In,
  In,
  Err extends DecoderError,
  Opts,
> extends DecoderValidatorBase<Out, In, Err, Opts> {
  constructor(public readonly decode: DecoderFunction<Out, In, Err, Opts>) {
    super();
  }
}
