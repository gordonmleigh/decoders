import { DecoderError } from './DecoderError.js';
import { Result } from './Result.js';

/**
 * Represents a function which can decode a value.
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
   * Decode a value, possibly validating or transforming it.
   *
   * @param value The input value
   * @returns [[OkResult]] on success or [[ErrorResult]] on failure.
   */
  decode(value: In, opts?: Opts): Result<Out, Err>;
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

export type AnyDecoder<
  Out = any,
  In = any,
  Err extends DecoderError = any,
  Opts = any,
> = Decoder<Out, In, Err, Opts>;

export type DecoderArray<
  Out = any,
  In = any,
  Err extends DecoderError = any,
  Opts = any,
> = Decoder<Out, In, Err, Opts>[];
