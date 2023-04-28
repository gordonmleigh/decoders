import { predicate } from './predicate.js';

/**
 * A predicate which requires a number to be an integer by
 * using Number.isSafeInteger().
 */
export const isInteger = predicate(Number.isSafeInteger).withError(
  'value:integer',
  'expected integer',
);
