import { DecoderError } from '../core/DecoderError.js';
import { DecoderValidator, validator } from '../core/DecoderValidator.js';
import { invalid, ok } from '../core/Result.js';

/**
 * Create a [[Decoder]] which tests for the given condition.
 */
export function predicate<Value>(
  test: (value: Value) => boolean,
): DecoderValidator<Value, Value, DecoderError<'value:condition'>> {
  return validator((value) => {
    if (test(value)) {
      return ok(value);
    }
    return invalid('value:condition', 'condition failure');
  });
}
