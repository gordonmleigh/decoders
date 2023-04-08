import { Decoder } from './Decoder.js';
import { DecodingAssertError } from './DecodingAssertError.js';

/**
 * Successfully decode the value or throw a [[DecoderError]].
 *
 * @param decoder The decoder to use.
 * @param value The value to decode.
 */
export function assert<Out, In>(decoder: Decoder<Out, In>, value: In): Out {
  const result = decoder.decode(value);
  if (!result.ok) {
    throw new DecodingAssertError(result.error);
  }
  return result.value;
}
