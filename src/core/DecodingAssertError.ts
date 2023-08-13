import { DecoderError } from './DecoderError.js';

/**
 * Thrown when {@link Decoder} `assert` fails to decode a value.
 */
export class DecodingAssertError<
  Err extends DecoderError = DecoderError,
> extends Error {
  public static readonly Name = 'DecodingAssertError';

  /**
   * Create a new instance with the specified errors.
   *
   * @param errors The errors encountered during decoding.
   */
  constructor(public readonly error: Err) {
    super(`decoding failed`);
    this.name = DecodingAssertError.Name;
  }
}
