import { Decoder, decoder } from '../core/Decoder.js';
import { DecoderError } from '../core/DecoderError.js';
import { invalid, ok } from '../core/Result.js';

/**
 * Create a {@link Decoder} which tests for the given condition.
 */
export function predicate<Value>(
  test: (value: Value) => boolean,
): Decoder<Value, Value, DecoderError<'value:condition'>> {
  return decoder((value) => {
    if (test(value)) {
      return ok(value);
    }
    return invalid('value:condition', 'condition failure');
  });
}
