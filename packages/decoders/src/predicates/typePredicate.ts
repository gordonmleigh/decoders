import { Decoder, decoder } from '../core/Decoder.js';
import { DecoderError } from '../core/DecoderError.js';
import { invalid, ok } from '../core/Result.js';
import { TypePredicate } from '../internal/TypePredicate.js';

/**
 * Create a {@link Decoder} which tests for the given type.
 *
 * @group Predicates
 */
export function typePredicate<Out extends In, In>(
  test: TypePredicate<Out, In>,
): Decoder<Out, In, DecoderError<'value:type'>> {
  return decoder((value) => {
    if (test(value)) {
      return ok(value);
    }
    return invalid('value:type', 'condition failure');
  });
}
