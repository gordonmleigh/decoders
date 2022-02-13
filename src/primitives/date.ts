import { Decoder } from '../core/Decoder.js';
import { invalid, ok, Result } from '../core/Result.js';
import { isDate } from '../internal/isDate.js';

/**
 * The error identifier returned when [[date]] fails.
 */
export const ExpectedDate = 'EXPECTED_DATE';

/**
 * A [[Decoder]] which can decode a Date value.
 */
export const date: Decoder<Date> = (value: unknown): Result<Date> =>
  isDate(value) ? ok(value) : invalid(ExpectedDate, 'expected date');
