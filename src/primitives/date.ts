import { Decoder } from '../core/Decoder';
import { invalid, ok, Result } from '../core/Result';
import { isDate } from '../util/isDate';

export const ExpectedDate = 'EXPECTED_DATE';

export const date: Decoder<Date> = (value: unknown): Result<Date> =>
  isDate(value) ? ok(value) : invalid(ExpectedDate, 'expected date');
