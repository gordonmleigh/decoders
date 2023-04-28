import { Decoder } from '../core/Decoder.js';
import { predicate } from './predicate.js';

/**
 * Error identifier returned by [[enumValue]] on failure.
 */
export const ExpectedEnumValue = 'EXPECTED_ENUM_VALUE';

/**
 * Creates a decoder for an enum.
 *
 * @param values The enum values.
 *
 * @example
 *
 * ```typescript
 * enum MyEnum {
 *   Red = 'red',
 *   Green = 'green',
 * }
 *
 * const decoder = enumValues(MyEnum);
 *
 * const result1 = decoder('red'); // = { ok: true, value: MyEnum.Red }
 * ```
 */
export function enumValue<T>(values: Record<string, T>): Decoder<T> {
  const allowedValues = Object.values(values);
  return predicate((value: T) => allowedValues.includes(value)).withError(
    'expected enum value',
    ExpectedEnumValue,
  );
}
