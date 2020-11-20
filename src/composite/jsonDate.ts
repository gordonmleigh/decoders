import { Decoder } from '../core/Decoder';
import { Result } from '../core/Result';
import { date } from '../primitives/date';

/**
 * A [[Decoder]] which can decode a Date value or an ISO date string.
 */
export const jsonDate: Decoder<Date> = (value: unknown): Result<Date> => {
  if (typeof value === 'string') {
    return date(new Date(value));
  }
  return date(value);
};
