import { choose } from '../composite/choose';
import { chain } from '../composite/chain';
import { predicate } from '../predicates/predicate';
import { ExpectedNumber, number } from '../primitives/number';
import { string } from '../primitives/string';
import { map } from './map';

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
 *
 * @category Converters
 */
export const strToNum = chain(
  string,
  predicate(/^\d+(\.(\d*))?$/.test, 'expected number', ExpectedNumber),
  map(parseFloat),
);

/**
 * Decoder which accepts a string and converts it to a number, or accepts a
 * numer directly.
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
export const normaliseNumber = choose(number, strToNum);
