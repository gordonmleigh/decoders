import { Decoder } from '../core/Decoder.js';
import { invalid, ok, Result } from '../core/Result.js';

/**
 * The default error identifier returned by {@link predicate}.
 */
export const ConditionFailure = 'CONDITION_FAILURE';

/**
 * Create a [[Decoder]] which tests for the given condition.
 * @param test A condition predicate function.
 * @param message An optional error message to return on failure.
 * @param id An optional error id to return on failure.
 * @param details Extra details, intended to be used in error formatting.
 */
export function predicate<T>(
  test: (value: T) => boolean,
  message = 'condition failure',
  id = ConditionFailure,
  details?: Record<string, any>,
): Decoder<T, T> {
  return new PredicateDecoder(test, message, id, details);
}

class PredicateDecoder<T> implements Decoder<T, T> {
  constructor(
    public readonly test: (value: T) => boolean,
    private readonly message = 'condition failure',
    private readonly id = ConditionFailure,
    private readonly details?: Record<string, any>,
  ) {}

  public decode(value: T): Result<T> {
    if (this.test(value)) {
      return ok(value);
    }
    return invalid(this.id, this.message, undefined, this.details);
  }
}
