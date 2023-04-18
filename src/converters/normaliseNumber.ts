import { choose } from '../composite/choose.js';
import { number } from '../primitives/number.js';
import { strToNum } from './strToNum.js';

/**
 * Decoder which accepts a string and converts it to a number, or accepts a
 * number directly.
 *
 * @example
 *
 * ```typescript
 * const decoder = normaliseNumber;
 *
 * const result1 = decoder('12') // = { ok: true, value: 12 }
 * const result2 = decoder('12.23') // = { ok: true, value: 12.23 }
 *
 * // a number is allowed
 * const result3 = decoder(12) // = { ok: true, value: 12 }
 *
 * // scientific notation is not allowed:
 * const result4 = decoder('12e10') // = { ok: false, error: [ ... ] }
 * ```
 */
export const normaliseNumber = choose(number, strToNum).withError(
  'value:number',
  'expected a number',
);
