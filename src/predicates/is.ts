import { Decoder } from '../core/Decoder.js';
import { predicate } from './predicate.js';

/**
 * The error identifier returned by [[is]] on failure.
 */
export const ExpectedSpecificValue = 'EXPECTED_SPECIFIC_VALUE';

/**
 * Creates a predicate which allows only the given value(s).
 *
 * @param options The values allowed.
 */
export function is<T>(...options: T[]): Decoder<T> {
  return predicate<T>(
    (value) => options.includes(value),
    'expected specific value',
    ExpectedSpecificValue,
    { options },
  );
}
