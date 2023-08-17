import { Decoder } from '../core/Decoder.js';
import { DecoderError } from '../core/DecoderError.js';
import { ValuesOf } from '../internal/typeUtils.js';
import { predicate } from './predicate.js';

/**
 * The {@link DecoderError} returned when a {@link enum} decoder fails.
 *
 * @group Types
 */
export type EnumDecoderError<T> = DecoderError<'value:enum'> & {
  options: T;
};

/**
 * Creates a {@link Decoder} for an enum.
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
 *
 * @group Predicates
 */
export function enumValue<const T extends Record<any, string | number>>(
  values: T,
): Decoder<ValuesOf<T>, unknown, EnumDecoderError<T>> {
  const options = Object.values(values);
  return predicate((value: any) => options.includes(value)).withError(
    'value:enum',
    'expected enum value',
    { options: values },
  );
}
