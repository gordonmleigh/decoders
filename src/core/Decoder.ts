import { DecoderOptions } from './DecoderOptions';
import { Result } from './Result';

/**
 * Represents a function which can decode a value.
 *
 * @template Out The output value type.
 * @template In The input value type.
 */
export interface Decoder<Out, In = unknown> {
  /**
   * Decode a value, possibly validating or transforming it.
   *
   * @param value The input value
   * @returns [[OkResult]] on success or [[ErrorResult]] on failure.
   */
  (value: In, opts?: DecoderOptions): Result<Out>;
}
