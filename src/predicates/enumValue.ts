import { DecoderError } from '../core/DecoderError.js';
import { DecoderValidator } from '../core/DecoderValidator.js';
import { ValuesOf } from '../internal/typeUtils.js';
import { predicate } from './predicate.js';

/**
 * The {@link DecoderError} returned when a {@link enum} decoder fails.
 */
export type EnumDecoderError<T> = DecoderError<'value:enum'> & {
  options: T;
};

/**
 * Creates a {@link DecoderValidator} for an enum.
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
export function enumValue<const T extends Record<any, string | number>>(
  values: T,
): DecoderValidator<ValuesOf<T>, unknown, EnumDecoderError<T>> {
  const options = Object.values(values);
  return predicate((value: any) => options.includes(value)).withError(
    'value:enum',
    'expected enum value',
    { options: values },
  );
}
