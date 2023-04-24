import { Decoder } from './Decoder.js';
import { DecoderError } from './DecoderError.js';
import { DecodingAssertError } from './DecodingAssertError.js';
import { Result } from './Result.js';

/**
 * Implements the [[Model]] interface for a given decoder.
 */
export class DecoderModel<
  Out extends In,
  In,
  Err extends DecoderError,
  Opts = void,
> implements Model<Out, In, Err, Opts>
{
  constructor(private readonly decoder: Decoder<Out, In, Err, Opts>) {}

  public readonly assert = (value: In, opts?: Opts): Out => {
    const result = this.decode(value, opts);
    if (!result.ok) {
      throw new DecodingAssertError(result.error);
    }
    return result.value;
  };

  public readonly decode = (value: In, opts?: any): Result<Out, Err> => {
    return this.decoder.decode(value, opts);
  };

  public readonly test = (value: In): value is Out => {
    const result = this.decoder.decode(value);
    return result.ok;
  };
}

/**
 * Represents a decoder that returns the value itself on success and throws
 * [[DecodingAssertError]] on error.
 */
export interface Model<
  Out extends In,
  In = unknown,
  Err extends DecoderError = DecoderError,
  Opts = void,
> {
  /**
   * Decode a value and return the decoded value, or throw
   * [[DecodingAssertError]] if decoding fails.
   */
  assert(value: In, opts?: Opts): Out;

  /**
   * Decode a value, possibly validating or transforming it.
   *
   * @param value The input value
   * @returns [[OkResult]] on success or [[ErrorResult]] on failure.
   */
  decode(value: In, opts?: Opts): Result<Out, Err>;

  /**
   * Returns true if the value can be decoded.
   */
  test(value: In, opts?: Opts): value is Out;
}

/**
 * Convert the given decoder into an [[AssertDecoder]], that will decode a value
 * and return the value itself on success or throw [[DecodingAssertError]] on
 * failure.
 *
 * @param decoder The decoder to wrap.
 */
export function model<Out extends In, In, Err extends DecoderError, Opts>(
  decoder: Decoder<Out, In, Err, Opts>,
): Model<Out, In, Err, Opts> {
  return new DecoderModel(decoder);
}
