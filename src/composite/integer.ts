import { integer } from '../predicates/integer.js';
import { number } from '../primitives/number.js';
import { chain } from './chain.js';

/**
 * Decoder which can decode a number and assert that it is an integer.
 *
 * @example
 *
 * ```typescript
 * const result1 = integer(12); // = { ok: true, value: 12 }
 * const result2 = integer(12.34); // = { ok: false, error: [ ... ] }
 * ```
 */
export const integer = chain(number, integer).withError(
  'value:integer',
  'expected integer',
);
