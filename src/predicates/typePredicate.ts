import { decoder } from '../composite/decoder.js';
import { Decoder } from '../core/Decoder.js';
import { DecoderError } from '../core/DecoderError.js';
import { ok } from '../core/Result.js';
import { TypePredicate } from '../internal/TypePredicate.js';

export const ExpectedType = 'EXPECTED_TYPE';

/**
 * Create a {@link Decoder} which tests for the given type.
 */
export function typePredicate<Out extends In, In>(
  test: TypePredicate<Out, In>,
  message?: string,
): Decoder<Out, In, DecoderError<'value:type'>>;
export function typePredicate<Out extends In, In, Type extends string>(
  test: TypePredicate<Out, In>,
  message: string | undefined,
  type: Type,
): Decoder<Out, In, DecoderError<Type>>;
export function typePredicate<Out extends In, In, Type extends string, Meta>(
  test: TypePredicate<Out, In>,
  message: string | undefined,
  type: Type,
  meta: Meta,
): Decoder<Out, In, DecoderError<Type> & Meta>;
export function typePredicate(
  test: TypePredicate<any>,
  text = 'condition failure',
  type = 'value:condition',
  meta?: any,
): Decoder<any, any, any> {
  return decoder((value) => {
    if (test(value)) {
      return ok(value);
    }
    return {
      ok: false,
      error: {
        type: type,
        text: text,
        ...meta,
      },
    };
  });
}
