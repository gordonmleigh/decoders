import { chain } from '../composite/chain.js';
import { regexp } from '../predicates/regexp.js';
import { ExpectedNumber } from '../primitives/number.js';
import { string } from '../primitives/string.js';
import { map } from './map.js';

/**
 * Decoder which converts a string to a number.
 *
 * @example
 *
 * ```typescript
 * const decoder = strToNum;
 *
 * const result1 = decoder('12') // = { ok: true, value: 12 }
 * const result2 = decoder('12.23') // = { ok: true, value: 12.23 }
 *
 * // a number is not allowed
 * const result3 = decoder(12) // = { ok: false, error: [ ... ] }
 *
 * // scientific notation is not allowed:
 * const result4 = decoder('12e10') // = { ok: false, error: [ ... ] }
 * ```
 */
export const strToNum = chain(
  string,
  regexp(/^\d+(\.(\d*))?$/, 'expected number', ExpectedNumber),
  map(parseFloat),
);
