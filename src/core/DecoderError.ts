/**
 * Represents an error which occurs during a decoding operation.
 */
export interface DecoderError {
  /**
   * A unique ID for the error, for programmatic use.
   */
  id: string;

  /**
   * A simple textual description of the error.
   */
  text: string;

  /**
   * The field causing the error. Possibly dot-separated path.
   */
  field?: string;
}
