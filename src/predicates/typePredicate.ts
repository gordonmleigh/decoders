import { Decoder } from '../core/Decoder.js';
import { invalid, ok, Result } from '../core/Result.js';
import { TypePredicate } from '../internal/TypePredicate.js';

export const ExpectedType = 'EXPECTED_TYPE';

/**
 * Create a {@link Decoder} which tests for the given type.
 * @param test A type predicate function.
 * @param message An optional error message to return on failure.
 * @param id An optional error id to return on failure.
 * @param details Extra details, intended to be used in error formatting.
 */
export function typePredicate<Out extends In, In = unknown>(
  test: TypePredicate<Out, In>,
  message = 'condition failure',
  id = ExpectedType,
  details?: Record<string, any>,
): Decoder<Out, In> {
  return new TypePredicateDecoder(test, message, id, details);
}

class TypePredicateDecoder<Out extends In, In = unknown>
  implements Decoder<Out, In>
{
  constructor(
    public readonly test: TypePredicate<Out, In>,
    private readonly message = 'expected specific type',
    private readonly id = ExpectedType,
    private readonly details?: Record<string, any>,
  ) {}

  public decode(value: In): Result<Out> {
    if (this.test(value)) {
      return ok(value);
    }
    return invalid(this.id, this.message, undefined, this.details);
  }
}
