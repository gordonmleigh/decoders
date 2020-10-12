import { Decoder } from '../core/Decoder';
import { invalid, ok, Result } from '../core/Result';
import { isDate } from '../internal/isDate';

/**
 * The error identifier returned when [[date]] fails.
 */
export const ExpectedDate = 'EXPECTED_DATE';

/**
 * A [[Decoder]] which can decode a Date value.
 */
export const date: Decoder<Date> = (value: unknown): Result<Date> =>
  isDate(value) ? ok(value) : invalid(ExpectedDate, 'expected date');
