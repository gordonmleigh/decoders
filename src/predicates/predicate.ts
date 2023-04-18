import { Decoder } from '../core/Decoder.js';
import { DecoderError } from '../core/DecoderError.js';
import { ok, Result } from '../core/Result.js';

/**
 * Create a [[Decoder]] which tests for the given condition.
 */
export function predicate<Value>(
  test: (value: Value) => boolean,
  message?: string,
): Decoder<Value, Value, DecoderError<'value:condition'>>;
export function predicate<Value, Type extends string>(
  test: (value: Value) => boolean,
  message: string | undefined,
  type: Type,
): Decoder<Value, Value, DecoderError<Type>>;
export function predicate<Value, Type extends string, Meta>(
  test: (value: Value) => boolean,
  message: string | undefined,
  type: Type,
  meta: Meta,
): Decoder<Value, Value, DecoderError<Type> & Meta>;
export function predicate(
  test: (value: any) => boolean,
  text = 'condition failure',
  type = 'value:condition',
  meta?: any,
): Decoder<any, any, any> {
  return new PredicateDecoder(test, type, text, meta);
}

class PredicateDecoder<Value, ErrorType extends string, ErrorMeta>
  implements Decoder<Value, Value, DecoderError<ErrorType> & ErrorMeta>
{
  public readonly test: (value: Value) => boolean;
  private readonly type: ErrorType;
  private readonly text: string;
  private readonly meta!: ErrorMeta;

  constructor(
    test: (value: Value) => boolean,
    type: ErrorType,
    text: string,
    meta?: ErrorMeta,
  ) {
    this.test = test;
    this.type = type;
    this.text = text;
    this.meta = meta as ErrorMeta;
  }

  public decode(
    value: Value,
  ): Result<Value, DecoderError<ErrorType> & ErrorMeta> {
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
