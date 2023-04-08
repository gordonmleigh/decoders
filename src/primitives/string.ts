import { Decoder } from '../core/Decoder.js';
import { invalid, ok } from '../core/Result.js';

/**
 * The error identifer returned when [[string]] fails.
 */
export const ExpectedString = 'EXPECTED_STRING';

/**
 * A [[Decoder]] which can decode a string value.
 */
export const string: Decoder<string> = {
  decode: (value) =>
    typeof value === 'string'
      ? ok(value)
      : invalid(ExpectedString, 'expected text'),
};
