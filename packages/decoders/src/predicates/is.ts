import { Decoder } from '../core/Decoder.js';
import { DecoderError } from '../core/DecoderError.js';
import { predicate } from './predicate.js';

/**
 * The {@link DecoderError} returned when a {@link is} decoder fails.
 *
 * @group Types
 */
export type IsDecoderError<T> = DecoderError<'value:is'> & {
  options: T[];
};

/**
 * Creates a predicate which allows only the given value(s).
 *
 * @param options The values allowed.
 *
 * @group Predicates
 */
export function is<const T>(
  ...options: T[]
): Decoder<T, unknown, IsDecoderError<T>> {
  return predicate((value: T) => options.includes(value)).withError(
    'value:is',
    'expected specific value',
    { options },
  );
}
