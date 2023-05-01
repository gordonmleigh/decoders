import { Decoder } from '../core/Decoder.js';
import { DecoderError } from '../core/DecoderError.js';
import { predicate } from './predicate.js';

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
): Decoder<string, string, RegexpDecoderError> {
  return predicate((x: string) => match.test(x)).withError(
    'value:regexp',
    `must match ${match}`,
  );
}
