import { trim } from '../converters/trim.js';
import { Decoder } from '../core/Decoder.js';
import { filterFalsey } from '../internal/filterFalsey.js';
import { hasMaxLength } from '../predicates/hasMaxLength.js';
import { hasMinLength } from '../predicates/hasMinLength.js';
import { string } from '../primitives/string.js';
import { chain } from './chain.js';

/**
 * Options to pass to a [[TextDecoder]].
 */
export interface TextDecoderOptions {
  /**
   * The maximum allowed length of a string.
   */
  maxLength?: number;

  /**
   * The minimum allowed length of a string. Defaults to 1 for a [[TextDecoder]].
   */
  minLength?: number;

  /**
   * Enabled/disable trimming whitespace from a string. Defaults to `true` for a
   * [[TextDecoder]].
   */
  trim?: boolean;
}

/**
 * A decoder which can decode a `string`, with additional options for
 * validation.
 */
export interface TextDecoder extends Decoder<string> {
  /**
   * A decoder which can decode a `string`, also allowing an empty string.
   */
  optional: Decoder<string>;

  /**
   * Create a decoder with the specified options.
   *
   * @param opts The validation options.
   */
  options(opts?: TextDecoderOptions): Decoder<string>;
}

/**
 * A decoder which can decode a `string`, with additional options for
 * validation. The default decoder provides sane defaults for decoding text:
 * trim whitespace from start and end, minimum length of 1 and no maximum.
 *
 * @example
 *
 * ```typescript
 * // text decoder with default options
 * const decoder = text;
 *
 * // specify a maximum length (default unlimited)
 * const decoderMax = text.options({ maxLength: 10 });
 *
 * // don't trim whitespace from start and end (default true)
 * const decoderNoTrim = text.options({ trim: false });
 *
 * // no minimum length (default 1)
 * const decoderNoMin = text.options({ minLength: 0 })
 * ```
 */
export const text: TextDecoder = Object.assign(textOptions(), {
  optional: textOptions({ minLength: 0 }),
  options: textOptions,
});

/**
 * @hidden
 */
function textOptions({
  maxLength,
  minLength = 1,
  trim: doTrim = true,
}: TextDecoderOptions = {}): Decoder<string> {
  return chain.all(
    filterFalsey(
      string,
      doTrim && trim,
      minLength && hasMinLength(minLength),
      typeof maxLength !== 'undefined' && hasMaxLength(maxLength),
    ),
  ) as Decoder<string>;
}
