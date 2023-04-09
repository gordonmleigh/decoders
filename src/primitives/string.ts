import { Decoder } from '../core/Decoder.js';
import { invalid, ok, Result } from '../core/Result.js';

/**
 * The error identifer returned when {@link string} fails.
 */
export const ExpectedString = 'EXPECTED_STRING';

/**
 * The error identifer returned when a string is the wrong length.
 */
export const ExpectedStringLength = 'EXPECTED_STRING_LENGTH';

/**
 * Options to pass to a {@link StringDecoder}.
 */
export interface StringDecoderOptions {
  /**
   * The maximum allowed length of a string.
   */
  maxLength?: number;

  /**
   * The minimum allowed length of a string.
   */
  minLength?: number;

  /**
   * Enabled/disable trimming whitespace from a string.
   */
  trim?: boolean;
}

class StringDecoder implements Decoder<string> {
  public readonly options: Readonly<StringDecoderOptions>;

  constructor(options: StringDecoderOptions = {}) {
    this.options = Object.freeze(options);
  }

  public decode(value: unknown): Result<string> {
    if (typeof value !== 'string') {
      return invalid(ExpectedString, 'expected string');
    }
    const str = this.options.trim ? value.trim() : value;

    if (
      this.options.maxLength !== undefined &&
      str.length > this.options.maxLength
    ) {
      return invalid(
        ExpectedStringLength,
        `expected max length ${this.options.maxLength}`,
      );
    }
    if (
      this.options.minLength !== undefined &&
      str.length < this.options.minLength
    ) {
      return invalid(
        ExpectedStringLength,
        `expected min length ${this.options.minLength}`,
      );
    }
    return ok(str);
  }

  public max(maxLength: number): StringDecoder {
    return this.withOptions({ maxLength });
  }

  public min(minLength: number): StringDecoder {
    return this.withOptions({ minLength });
  }

  public trim(): StringDecoder {
    return this.withOptions({ trim: true });
  }

  public withOptions(options: StringDecoderOptions): StringDecoder {
    return new StringDecoder({
      ...this.options,
      ...options,
    });
  }
}

/**
 * A {@link Decoder} which can decode a string value.
 */
export const string = new StringDecoder();

/**
 * A {@link Decoder} which expects a non-empty string. The input will be trimmed
 * of whitespace.
 */
export const text = new StringDecoder({
  minLength: 1,
  trim: true,
});
