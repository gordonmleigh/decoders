import { Decoder } from './Decoder.js';

/**
 * Type predicate which returns true if the decoder does not return an error for
 * the given value.
 *
 * @group Core
 */
export function isValid<Out extends In, In = unknown>(
  decoder: Decoder<Out, In>,
  value: In,
): value is Out {
  return decoder.decode(value).ok;
}
