import { Decoder } from '../core/Decoder';
import { predicate } from './predicate';

/**
 * Create a predicate which fails if the input does not match the given regular
 * expression.
 *
 * @param match The regular expression to match.
 * @param message The message to return on failure.
 * @param id The error identifier to return on failure.
 */
export function regexp(
  match: RegExp,
  message?: string,
  id?: string,
): Decoder<string, string> {
  return predicate((x) => match.test(x), message, id);
}
