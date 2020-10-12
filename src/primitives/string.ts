import { Decoder } from '../core/Decoder';
import { invalid, ok } from '../core/Result';

/**
 * The error identifer returned when [[string]] fails.
 */
export const ExpectedString = 'EXPECTED_STRING';

/**
 * A [[Decoder]] which can decode a string value.
 */
export const string: Decoder<string> = (value) =>
  typeof value === 'string'
    ? ok(value)
    : invalid(ExpectedString, 'expected text');
