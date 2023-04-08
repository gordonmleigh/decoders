import { Decoder } from '../core/Decoder.js';
import { invalid, ok } from '../core/Result.js';

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
  return {
    decode: (value) =>
      Object.values(values).includes(value as T)
        ? ok(value as T)
        : invalid(ExpectedEnumValue, 'expected enum value', undefined, {
            options: values,
          }),
  };
}
