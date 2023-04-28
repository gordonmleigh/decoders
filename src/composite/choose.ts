import { AnyDecoder, DecoderArray } from '../core/Decoder.js';
import { DecoderError } from '../core/DecoderError.js';
import { DecoderValidator, validator } from '../core/DecoderValidator.js';
import { error } from '../core/Result.js';
import { UnionToIntersection } from '../internal/typeUtils.js';

/**
 * Get the output type of an array of decoders.
 *
 * @example
 *
 * ```typescript
 * type A = ChooseOutputType<[Decoder<number>, Decoder<string>]>;
 *
 * // equivalent to
 * type B = number | string;
 * ```
 */
export type ChooseOutputType<T> = T extends DecoderArray<infer Out>
  ? Out
  : never;

export type ChooseError<T extends DecoderArray> =
  DecoderError<'composite:choose'> & {
    choose: {
      [K in keyof T]: T[K] extends AnyDecoder<any, any, infer Err>
        ? Err
        : never;
    };
  };

export type ChooseOptionsType<T> = T extends DecoderArray<
  any,
  any,
  any,
  infer Opts
>
  ? UnionToIntersection<Opts>
  : never;

export type ChooseDecoderType<
  Decoders extends DecoderArray<any, In>,
  In = unknown,
> = DecoderValidator<
  ChooseOutputType<Decoders>,
  In,
  ChooseError<Decoders>,
  ChooseOptionsType<Decoders>
>;

/**
 * Create a decoder which can succesfully decode an input value using one of the
 * supplie decoders. The decoders are invoked in the given order until one is
 * successful. If none are successful, the errors from all decoders are
 * concatenated and returned.
 *
 * @param options The possible decoders to try.
 *
 * @example
 * ```typescript
 * const choice = choose(number, string); // is a Decoder<number|string>;
 *
 * const result1 = choice(1); // = { ok: true, value: 1 }
 * const result2 = choice('hello'); // = { ok: true, value: 'hello' }
 *
 * // the `error` field will contain the errors of all decoders
 * const result3 = choice(false); // = { ok: false, error: [ ... ] }
 * ```
 */
export function choose<Decoders extends DecoderArray<any, In>, In = unknown>(
  ...options: Decoders
): ChooseDecoderType<Decoders, In> {
  return validator((value, opts) => {
    const errors: DecoderError[] = [];

    for (const decoder of options) {
      const result = decoder.decode(value, opts);
      if (result.ok) {
        return result;
      }
      errors.push(result.error);
    }

    return error({
      type: 'composite:choose',
      text: 'failed to match one of',
      choose: errors as ChooseError<Decoders>['choose'],
    });
  });
}
