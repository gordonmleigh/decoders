import { Decoder } from './Decoder';
import { makeAssertDecoder } from './makeAssertDecoder';
import { Result } from './Result';

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
   * Returns true if the value can be decoded.
   */
  test(value: unknown): value is Out;

  /**
   * Decode a value, possibly validating or transforming it.
   *
   * @param value The input value
   * @returns [[OkResult]] on success or [[ErrorResult]] on failure.
   */
  validate(value: unknown): Result<Out>;
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

class DecoderModel<T> implements Model<T> {
  constructor(public readonly validate: Decoder<T>) {}

  public readonly assert = makeAssertDecoder(this.validate);

  public readonly test = (value: unknown): value is T => {
    const result = this.validate(value);
    return result.ok;
  };
}
