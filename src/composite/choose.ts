import { AnyDecoder, Decoder, DecoderArray, decoder } from '../core/Decoder.js';
import { DecoderError } from '../core/DecoderError.js';
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

/**
 * Determine the union which represents the possible error types for multiple
 * decoders.
 */
export type ChooseError<T extends DecoderArray> =
  DecoderError<'composite:choose'> & {
    choose: {
      [K in keyof T]: T[K] extends AnyDecoder<any, any, infer Err>
        ? Err
        : never;
    };
  };

/**
 * Determine the combined options type for multiple decoders.
 */
export type ChooseOptionsType<T> = T extends DecoderArray<
  any,
  any,
  any,
  infer Opts
>
  ? UnionToIntersection<Opts>
  : never;

/**
 * The specific {@link Decoder} type for a choose decoder.
 */
export type ChooseDecoderType<
  Decoders extends DecoderArray<any, In>,
  In = unknown,
> = Decoder<
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
 * // is a Decoder<number|string>:
 * const choice = choose(number, string);
 *
 * const result1 = choice(1); // = { ok: true, value: 1 }
 * const result2 = choice('hello'); // = { ok: true, value: 'hello' }
 * ```
 */
export function choose<Decoders extends DecoderArray<any, In>, In = unknown>(
  ...options: Decoders
): ChooseDecoderType<Decoders, In> {
  return decoder((value, opts) => {
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
