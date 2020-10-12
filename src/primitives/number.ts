import { Decoder } from '../core/Decoder';
import { invalid, ok } from '../core/Result';

/**
 * The error identifier returned when [[number]] fails.
 */
export const ExpectedNumber = 'EXPECTED_NUMBER';

/**
 * A [[decoder]] which can decode a number value.
 */
export const number: Decoder<number> = (value) =>
  typeof value === 'number' && !Number.isNaN(value)
    ? ok(value)
    : invalid(ExpectedNumber, 'expected number');
