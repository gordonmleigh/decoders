import { DecoderError } from '../core/DecoderError.js';
import { DecoderValidator } from '../core/DecoderValidator.js';
import { predicate } from './predicate.js';

export type IsDecoderError<T> = DecoderError<'value:is'> & {
  options: T[];
};

/**
 * Creates a predicate which allows only the given value(s).
 *
 * @param options The values allowed.
 */
export function is<const T>(
  ...options: T[]
): DecoderValidator<T, unknown, IsDecoderError<T>> {
  return predicate((value: T) => options.includes(value)).withError(
    'value:is',
    'expected specific value',
    { options },
  );
}
