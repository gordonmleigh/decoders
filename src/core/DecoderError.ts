/**
 * Represents an error which occurs during a decoding operation.
 */
export interface DecoderError<Key extends string = string> {
  /**
   * A unique ID for the error, for programmatic use.
   */
  type: Key;

  /**
   * A simple textual description of the error.
   */
  text: string;
}
