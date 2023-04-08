import { Decoder } from '../core/Decoder.js';
import { invalid, ok, Result } from '../core/Result.js';

/**
 * Error identifer returned when [[boolean]] fails.
 */
export const ExpectedBoolean = 'EXPECTED_BOOLEAN';

/**
 * A [[Decoder]] which can decode a boolean value.
 */
export const boolean: Decoder<boolean> = {
  decode: (value: unknown): Result<boolean> =>
    typeof value === 'boolean'
      ? ok(value)
      : invalid(ExpectedBoolean, 'expected boolean'),
};
