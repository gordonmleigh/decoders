import { Decoder } from '../core/Decoder.js';
import { DecoderError } from '../core/DecoderError.js';
import { ok, Result } from '../core/Result.js';
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
  return new TypePredicateDecoder(test, type, text, meta);
}

class TypePredicateDecoder<
  Out extends In,
  In,
  ErrorType extends string,
  ErrorMeta,
> implements Decoder<Out, In>
{
  public readonly test: TypePredicate<Out, In>;
  private readonly type: ErrorType;
  private readonly text: string;
  private readonly meta!: ErrorMeta;

  constructor(
    test: TypePredicate<Out, In>,
    type: ErrorType,
    text: string,
    meta?: ErrorMeta,
  ) {
    this.test = test;
    this.type = type;
    this.text = text;
    this.meta = meta as ErrorMeta;
  }

  public decode(value: In): Result<Out> {
    if (this.test(value)) {
      return ok(value);
    }
    return {
      ok: false,
      error: {
        type: this.type,
        text: this.text,
        ...this.meta,
      },
    };
  }
}
