import { chain } from './chain';
import { isInt } from '../predicates/isInt';
import { number } from '../primitives/number';

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
export const integer = chain(number, isInt);
