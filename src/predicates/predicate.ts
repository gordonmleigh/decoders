import { Decoder } from '../core/Decoder';
import { invalid, ok } from '../core/Result';

export const ConditionFailure = 'CONDITION_FAILURE';

export function predicate<T>(
  test: (value: T) => boolean,
  message = 'condition failure',
  id = ConditionFailure,
): Decoder<T, T> {
  return (value) => (test(value) ? ok(value) : invalid(id, message));
}
