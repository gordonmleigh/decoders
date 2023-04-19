import { WithErrorFn, withError } from '../converters/withError.js';
import { Decoder, InputType, OutputType } from '../core/Decoder.js';
import { DecoderError } from '../core/DecoderError.js';
import { DecoderOptions } from '../core/DecoderOptions.js';
import { Result, ok } from '../core/Result.js';
import { AnyDecoder, DecoderArray } from '../internal/AnyDecoder.js';

export type DecoderChain<Decoders> = Decoders extends readonly [AnyDecoder]
  ? Decoders
  : Decoders extends readonly [any, ...infer Rest extends DecoderArray]
  ? readonly [Decoder<InputType<Rest[0]>, any>, ...DecoderChain<Rest>]
  : never;

export type ConstrainedDecoderArray<Out, In = unknown, Middle = any> =
  | [Decoder<Out, In>]
  | [Decoder<Middle, In>, Decoder<Out, any>]
  | [Decoder<Middle, In>, ...DecoderArray, Decoder<Out, Middle>];

export type ChainInput<D extends DecoderArray> = D extends [
  infer First,
  ...DecoderArray,
]
  ? InputType<First>
  : never;

export type ChainOutput<D extends DecoderArray> = D extends [
  ...DecoderArray,
  infer Last,
]
  ? OutputType<Last>
  : never;

export type ChainError<D extends DecoderArray> = D extends DecoderArray<
  any,
  any,
  infer Err
>
  ? Err
  : never;

export interface ChainDecoderType<
  Chain extends DecoderArray,
  Err extends DecoderError = ChainError<Chain>,
> extends Decoder<ChainOutput<Chain>, ChainInput<Chain>, Err> {
  withError: WithErrorFn<this>;
}

export interface ChainDecoderFactory<Out, In = unknown, Middle = any> {
  schema<Chain extends ConstrainedDecoderArray<Out, In, Middle>>(
    ...decoders: DecoderChain<Chain>
  ): ChainDecoderType<Chain>;
}

/**
 * Compose multiple decoders together to create a single decoder.
 */
export function chain<Chain extends DecoderArray>(
  ...decoders: DecoderChain<Chain>
): ChainDecoderType<Chain> {
  return new ChainDecoder(decoders);
}

/**
 * Helper function to allow the decoder types to be constrained and the error
 * type inferred.
 */
export function chainType<
  Out,
  In = unknown,
  Middle = any,
>(): ChainDecoderFactory<Out, In, Middle> {
  return ChainDecoder;
}

class ChainDecoder<
  Chain extends DecoderArray,
  Err extends DecoderError = ChainError<Chain>,
> implements ChainDecoderType<Chain, Err>
{
  public static readonly schema = <Chain extends DecoderArray>(
    ...chain: DecoderChain<Chain>
  ): ChainDecoder<Chain> => {
    return new this(chain);
  };

  constructor(public readonly decoders: DecoderChain<Chain>) {}

  public decode(
    value: ChainInput<Chain>,
    opts?: DecoderOptions,
  ): Result<ChainOutput<Chain>, Err> {
    let next = value;

    for (const decoder of this.decoders) {
      const result = decoder.decode(next, opts);
      if (!result.ok) {
        return result;
      }
      next = result.value;
    }

    return ok(next);
  }

  /**
   * Return a new decoder that returns the given error on failure instead of the
   * default one.
   */
  public withError = withError(this).map;
}
