import { decoder } from '../composite/decoder.js';
import { Decoder } from '../core/Decoder.js';
import { DecoderError } from '../core/DecoderError.js';
import { ok } from '../core/Result.js';

/**
 * Create a [[Decoder]] which tests for the given condition.
 */
export function predicate<Value>(
  test: (value: Value) => boolean,
): Decoder<Value, Value, DecoderError<'value:condition'>>;
export function predicate<Value, Type extends string>(
  test: (value: Value) => boolean,
  type: Type,
  message: string | undefined,
): Decoder<Value, Value, DecoderError<Type>>;
export function predicate<Value, Type extends string, Meta>(
  test: (value: Value) => boolean,
  type: Type,
  message: string,
  meta: Meta,
): Decoder<Value, Value, DecoderError<Type> & Meta>;
export function predicate(
  test: (value: any) => boolean,
  type = 'value:condition',
  text = 'condition failure',
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
