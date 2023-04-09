import { Decoder, InputType, OutputType } from '../core/Decoder.js';
import { DecoderOptions } from '../core/DecoderOptions.js';
import { ok, Result } from '../core/Result.js';

type DecoderArray = Decoder<any, any>[];

export type DecoderChain<D> = D extends readonly [Decoder<any, any>]
  ? D
  : D extends readonly [any, ...infer Rest extends DecoderArray]
  ? readonly [Decoder<InputType<Rest[0]>, any>, ...DecoderChain<Rest>]
  : never;

type ChainInput<D extends DecoderArray> = D extends [
  infer First,
  ...DecoderArray,
]
  ? InputType<First>
  : never;

type ChainOutput<D extends DecoderArray> = D extends [
  ...DecoderArray,
  infer Last,
]
  ? OutputType<Last>
  : never;

/**
 * Compose multiple decoders together to create a single decoder.
 */

export function chain<Chain extends DecoderArray>(
  ...decoders: DecoderChain<Chain>
): ChainDecoder<Chain>;
export function chain<T>(
  ...decoders: Decoder<T, T>[]
): ChainDecoder<Decoder<T, T>[]>;
export function chain<Out, In>(
  first: Decoder<Out, In>,
  ...decoders: Decoder<Out, Out>[]
): ChainDecoder<Decoder<Out, Out>[]>;
export function chain(
  ...decoders: Decoder<any, any>[]
): ChainDecoder<Decoder<any, any>[]> {
  return new ChainDecoder(decoders as any);
}

class ChainDecoder<Chain extends DecoderArray>
  implements Decoder<ChainOutput<Chain>, ChainInput<Chain>>
{
  constructor(public readonly decoders: DecoderChain<Chain>) {}

  public decode(
    value: ChainInput<Chain>,
    opts?: DecoderOptions,
  ): Result<ChainOutput<Chain>> {
    let next = value;

    for (const decoder of this.decoders) {
      const result = decoder.decode(next, opts);
      if (!result.ok) {
        return result as any;
      }
      next = result.value;
    }

    return ok(next);
  }
}
