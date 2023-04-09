import { Decoder } from '../core/Decoder.js';
import { DecoderError } from '../core/DecoderError.js';
import { DecoderOptions } from '../core/DecoderOptions.js';
import { error, Result } from '../core/Result.js';

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
export type ChooseOutputType<T> = T extends Decoder<infer Out, any>[]
  ? Out
  : never;

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
export function choose<Decoders extends Decoder<any, In>[], In = unknown>(
  ...options: Decoders
): Decoder<ChooseOutputType<Decoders>, In> {
  return new ChooseDecoder(options);
}

class ChooseDecoder<Decoders extends Decoder<any, In>[], In = unknown>
  implements Decoder<ChooseOutputType<Decoders>, In>
{
  constructor(public readonly options: Decoders) {}

  public decode(
    value: In,
    opts?: DecoderOptions,
  ): Result<ChooseOutputType<Decoders>> {
    const errors: DecoderError[] = [];

    for (const decoder of this.options) {
      const result = decoder.decode(value, opts);
      if (result.ok) {
        return result;
      }
      errors.push(...result.error);
    }

    return error(errors);
  }
}
