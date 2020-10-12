import { Decoder } from '../core/Decoder';
import { invalid, ok } from '../core/Result';

export const ExpectedSpecificValue = 'EXPECTED_SPECIFIC_VALUE';

export function is<T>(...options: T[]): Decoder<T> {
  return (value) =>
    options.includes(value as T)
      ? ok(value as T)
      : invalid(ExpectedSpecificValue, 'expected specific value');
}
