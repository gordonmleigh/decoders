import { Decoder } from './Decoder';
import { DecodingAssertError } from './DecodingAssertError';

/**
 * Represents a decoder that returns the value itself on success and throws
 * [[DecodingAssertError]] on error.
 */
export interface AssertDecoder<Out, In = unknown> {
  /**
   * Decode a value an return the decoded value, or throw 
   * [[DecodingAssertError]] if decoding fails.
   */
  (value: In): Out;
}

/**
 * Convert the given decoder into an [[AssertDecoder]], that will decode a value
 * and return the value itself on success or throw [[DecodingAssertError]] on
 * failure.
 * 
 * @param decoder The decoder to wrap.
 */
export function assert<Out, In>(
  decoder: Decoder<Out, In>,
): AssertDecoder<Out, In> {
  return (value: In): Out => {
    const result = decoder(value);
    if (!result.ok) {
      throw new DecodingAssertError(result.error);
    }
    return result.value;
  };
}
