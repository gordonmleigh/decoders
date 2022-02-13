import { DecoderError } from './DecoderError.js';

/**
 * Thrown when a [[AssertDecoder]] fails to decode a value.
 */
export class DecodingAssertError extends Error {
  public static readonly Name = 'DecodingAssertError';

  /**
   * Create a new instance with the specified errors.
   *
   * @param errors The errors encountered during decoding.
   */
  constructor(public readonly errors: DecoderError[]) {
    super(`decoding failed`);
    this.name = DecodingAssertError.Name;
  }
}
