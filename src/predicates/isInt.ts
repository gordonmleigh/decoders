import { predicate } from './predicate.js';

/**
 * Error identifier returned by [[isInt]] on failure.
 */
export const ExpectedInteger = 'EXPECTED_INTEGER';

/**
 * A predicate which requires a number to be an integer by
 * using Number.isSafeInteger().
 */
export const isInt = predicate<number>(
  Number.isSafeInteger,
  'expected integer',
  ExpectedInteger,
);
