import { Decoder } from '../core/Decoder';
import { invalid, ok } from '../core/Result';

export const ExpectedEnumValue = 'EXPECTED_ENUM_VALUE';

export function enumValue<T>(values: Record<string, T>): Decoder<T> {
  return (value) =>
    Object.values(values).includes(value as T)
      ? ok(value as T)
      : invalid(ExpectedEnumValue, 'expected enum value');
}
