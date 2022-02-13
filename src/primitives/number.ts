import { Decoder } from '../core/Decoder.js';
import { invalid, ok } from '../core/Result.js';

/**
 * The error identifier returned when [[number]] fails.
 */
export const ExpectedNumber = 'EXPECTED_NUMBER';

/**
 * A [[decoder]] which can decode a number value.
 */
export const number: Decoder<number> = (value) =>
  typeof value === 'number' && Number.isFinite(value)
    ? ok(value)
    : invalid(ExpectedNumber, 'expected number');
