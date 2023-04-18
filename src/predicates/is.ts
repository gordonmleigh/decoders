import { Decoder } from '../core/Decoder.js';
import { DecoderError } from '../core/DecoderError.js';
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
): Decoder<T, unknown, IsDecoderError<T>> {
  return predicate(
    (value: T) => options.includes(value),
    'expected specific value',
    'value:is',
    { options },
  );
}
