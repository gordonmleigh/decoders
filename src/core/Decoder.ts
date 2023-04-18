import { DecoderError } from './DecoderError.js';
import { DecoderOptions } from './DecoderOptions.js';
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
> {
  /**
   * Decode a value, possibly validating or transforming it.
   *
   * @param value The input value
   * @returns [[OkResult]] on success or [[ErrorResult]] on failure.
   */
  decode(value: In, opts?: DecoderOptions): Result<Out, Err>;
}

/**
 * Determine the input type of the decoder.
 */
export type InputType<T> = T extends Decoder<any, infer In> ? In : never;

/**
 * Determine the output type of the decoder.
 */
export type OutputType<T> = T extends Decoder<infer Out, any> ? Out : never;

/**
 * Determine the error type of the decoder.
 */
export type ErrorType<T> = T extends Decoder<any, any, infer Err> ? Err : never;
