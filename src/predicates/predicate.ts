import { Decoder } from '../core/Decoder';
import { invalid, ok } from '../core/Result';

/**
 * The default error identifier returned by [[predicate]].
 */
export const ConditionFailure = 'CONDITION_FAILURE';

/**
 * Create a [[Decoder]] which tests for the given condition.
 * @param test A condition predicate function.
 * @param message An optional error message to return on failure.
 * @param id An optional error id to return on failure.
 */
export function predicate<T>(
  test: (value: T) => boolean,
  message = 'condition failure',
  id = ConditionFailure,
): Decoder<T, T> {
  return (value) => (test(value) ? ok(value) : invalid(id, message));
}
