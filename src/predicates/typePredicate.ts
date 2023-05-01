import { DecoderError } from '../core/DecoderError.js';
import { DecoderValidator, validator } from '../core/DecoderValidator.js';
import { invalid, ok } from '../core/Result.js';
import { TypePredicate } from '../internal/TypePredicate.js';

export const ExpectedType = 'EXPECTED_TYPE';

/**
 * Create a {@link DecoderValidator} which tests for the given type.
 */
export function typePredicate<Out extends In, In>(
  test: TypePredicate<Out, In>,
): DecoderValidator<Out, In, DecoderError<'value:type'>> {
  return validator((value) => {
    if (test(value)) {
      return ok(value);
    }
    return invalid('value:type', 'condition failure');
  });
}
