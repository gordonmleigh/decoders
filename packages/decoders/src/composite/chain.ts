import {
  AnyDecoder,
  Decoder,
  DecoderArray,
  InputType,
  OutputType,
  decoder,
} from '../core/Decoder.js';
import { DecoderError } from '../core/DecoderError.js';
import { ok } from '../core/Result.js';
import { Schema } from '../internal/Schema.js';
import { UnionToIntersection } from '../internal/typeUtils.js';

/**
 * A chain of {@link Decoder} objects with matching input/output types. Used as
 * input to the {@link chain} decoder.
 *
 * @group Types
 */
export type DecoderChain<Decoders> = Decoders extends readonly [AnyDecoder]
  ? Decoders
  : Decoders extends readonly [any, ...infer Rest extends DecoderArray]
  ? readonly [AnyDecoder<InputType<Rest[0]>>, ...DecoderChain<Rest>]
  : never;

/**
 * A chain of {@link Decoder} objects with matching input/output types, with
 * constrained input, output and intermediate value types. Used as input to the
 * {@link chain} decoder.
 *
 * @group Types
 */
export type ConstrainedDecoderArray<Out, In = unknown, Middle = any> =
  | [AnyDecoder<Out, In>]
  | [AnyDecoder<Middle, In>, AnyDecoder<Out, Middle>]
  | [AnyDecoder<Middle, In>, ...DecoderArray, AnyDecoder<Out, Middle>];

/**
 * Determine the input type of a chain of {@link Decoder} objects; i.e the input
 * type of the _first_ decoder in the list.
 *
 * @group Types
 */
export type ChainInput<D extends DecoderArray> = D extends [
  infer First,
  ...DecoderArray,
]
  ? InputType<First>
  : never;

/**
 * Determine the output type of a chain of {@link Decoder} objects; i.e the
 * output type of the _last_ decoder in the list.
 *
 * @group Types
 */
export type ChainOutput<D extends DecoderArray> = D extends [
  ...DecoderArray,
  infer Last,
]
  ? OutputType<Last>
  : never;

/**
 * Determine the error type of a chain of {@link Decoder} objects; i.e the union
 * of all the possible errors in the chain.
 *
 * @group Types
 */
export type ChainError<D extends DecoderArray> = D extends DecoderArray<
  any,
  any,
  infer Err
>
  ? Err
  : never;

/**
 * Determine the options type of a chain of {@link Decoder} objects; i.e the
 * intersection of all the possible options objects in the chain.
 *
 * @group Types
 */
export type ChainOptions<D extends DecoderArray> = D extends DecoderArray<
  any,
  any,
  any,
  infer Options
>
  ? UnionToIntersection<Exclude<Options, void>>
  : never;

/**
 * The specific {@link Decoder} type for the {@link chain} decoder.
 *
 * @group Types
 */
export type ChainDecoderType<
  Chain extends DecoderArray,
  Err extends DecoderError = ChainError<Chain>,
  Opts = ChainOptions<Chain>,
> = Decoder<ChainOutput<Chain>, ChainInput<Chain>, Err, Opts>;

/**
 * Represents an object which can create a {@link chain} {@link Decoder} with
 * constrained input, output and intermediate value types.
 *
 * @group Types
 */
export interface ChainDecoderFactory<Out, In = unknown, Middle = any> {
  schema<Chain extends ConstrainedDecoderArray<Out, In, Middle>>(
    ...decoders: DecoderChain<Chain>
  ): ChainDecoderType<Chain>;
}

/**
 * Compose multiple {@link Decoder} objects together to create a single decoder.
 * The decoders are run serially with the input of each decoder being the output
 * of the previous decoder in the chain.
 *
 * @remark
 * This decoder is used to compose the behaviour of multiple decoders—either to
 * combine multiple refinements (e.g. max length and min length), or to combine
 * processing and type conversion steps, or both.
 *
 * @example
 * ```typescript
 * const strToNum = chain(string, trim, convertStrToNum, min(5));
 * ```
 *
 * @group Composite
 */
export function chain<Chain extends DecoderArray>(
  ...decoders: DecoderChain<Chain>
): ChainDecoderType<Chain> {
  return decoder((value, opts) => {
    let next = value;

    for (const decoder of decoders) {
      const result = decoder.decode(next, opts);
      if (!result.ok) {
        return result;
      }
      next = result.value;
    }

    return ok(next);
  });
}

/**
 * Helper function to allow the decoder types to be constrained and the error
 * type inferred.
 *
 * @remarks
 * This would be used when you want to explicitly specify the input, output or
 * middle types, but want to benefit from type inference for the rest of the
 * parameters.
 *
 * @group Composite
 */
export function chainType<
  Out,
  In = unknown,
  Middle = any,
>(): ChainDecoderFactory<Out, In, Middle> {
  return new Schema(chain as (...args: DecoderArray) => AnyDecoder);
}
