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
 * @param message The message to return on failure.
 * @param type The error identifier to return on failure.
 */
export function regexp(
  match: RegExp,
  message?: string,
): Decoder<string, string, RegexpDecoderError>;
export function regexp<Type extends string>(
  match: RegExp,
  message: string | undefined,
  type: Type,
): Decoder<string, string, RegexpDecoderError<Type>>;
export function regexp(
  match: RegExp,
  message = `must match ${match}`,
  type = 'value:regexp',
): Decoder<string, string, RegexpDecoderError<string>> {
  return predicate((x) => match.test(x), message, type);
}
