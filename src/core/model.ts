import { Decoder } from './Decoder.js';
import { DecoderOptions } from './DecoderOptions.js';
import { DecodingAssertError } from './DecodingAssertError.js';
import { Result } from './Result.js';

/**
 * Implements the [[Model]] interface for a given decoder.
 */
export class DecoderModel<T> implements Model<T> {
  constructor(private readonly decoder: Decoder<T>) {}

  public readonly assert = (value: unknown, opts?: DecoderOptions): T => {
    const result = this.decode(value, opts);
    if (!result.ok) {
      throw new DecodingAssertError(result.error);
    }
    return result.value;
  };

  public readonly decode = (
    value: unknown,
    opts?: DecoderOptions,
  ): Result<T> => {
    return this.decoder.decode(value, opts);
  };

  public readonly test = (value: unknown): value is T => {
    const result = this.decoder.decode(value);
    return result.ok;
  };
}

/**
 * Represents a decoder that returns the value itself on success and throws
 * [[DecodingAssertError]] on error.
 */
export interface Model<Out> {
  /**
   * Decode a value and return the decoded value, or throw
   * [[DecodingAssertError]] if decoding fails.
   */
  assert(value: unknown): Out;

  /**
   * Decode a value, possibly validating or transforming it.
   *
   * @param value The input value
   * @returns [[OkResult]] on success or [[ErrorResult]] on failure.
   */
  decode(value: unknown): Result<Out>;

  /**
   * Returns true if the value can be decoded.
   */
  test(value: unknown): value is Out;
}

/**
 * Convert the given decoder into an [[AssertDecoder]], that will decode a value
 * and return the value itself on success or throw [[DecodingAssertError]] on
 * failure.
 *
 * @param decoder The decoder to wrap.
 */
export function model<Out>(decoder: Decoder<Out>): Model<Out> {
  return new DecoderModel(decoder);
}
