import { Decoder } from '../core/Decoder.js';
import { DecoderError } from '../core/DecoderError.js';
import { typePredicate } from './typePredicate.js';

export type RegexpDecoderError<T extends string = 'value:regexp'> =
  DecoderError<T>;

/**
 * Create a predicate which fails if the input does not match the given regular
 * expression.
 *
 * @param match The regular expression to match.
 */
export function regexp(
  match: RegExp,
): Decoder<string, unknown, RegexpDecoderError> {
  return typePredicate(
    (x): x is string => typeof x === 'string' && match.test(x),
  ).withError('value:regexp', `must match ${match}`);
}
