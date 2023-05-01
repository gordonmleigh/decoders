import {
  AnyDecoder,
  DecoderArray,
  InputType,
  OutputType,
} from '../core/Decoder.js';
import { DecoderError } from '../core/DecoderError.js';
import {
  AnyDecoderValidator,
  DecoderValidator,
  validator,
} from '../core/DecoderValidator.js';
import { ok } from '../core/Result.js';
import { Schema } from '../internal/Schema.js';
import { UnionToIntersection } from '../internal/typeUtils.js';

/**
 * A chain of decoders with matching input/output types.
 */
export type DecoderChain<Decoders> = Decoders extends readonly [AnyDecoder]
  ? Decoders
  : Decoders extends readonly [any, ...infer Rest extends DecoderArray]
  ? readonly [AnyDecoder<InputType<Rest[0]>>, ...DecoderChain<Rest>]
  : never;

/**
 * A chain of decoder objects with matching input/output types, with
 * constrained input, output and intermediate value types.
 */
export type ConstrainedDecoderArray<Out, In = unknown, Middle = any> =
  | [AnyDecoder<Out, In>]
  | [AnyDecoder<Middle, In>, AnyDecoder<Out, Middle>]
  | [AnyDecoder<Middle, In>, ...DecoderArray, AnyDecoder<Out, Middle>];

/**
 * Determine the input type of a chain of decoder objects.
 */
export type ChainInput<D extends DecoderArray> = D extends [
  infer First,
  ...DecoderArray,
]
  ? InputType<First>
  : never;

/**
 * Determine the output type of a chain of decoder objects.
 */
export type ChainOutput<D extends DecoderArray> = D extends [
  ...DecoderArray,
  infer Last,
]
  ? OutputType<Last>
  : never;

/**
 * Determine the error type of a chain of decoder objects.
 */
export type ChainError<D extends DecoderArray> = D extends DecoderArray<
  any,
  any,
  infer Err
>
  ? Err
  : never;

/**
 * Determine the options type of a chain of decoder objects.
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
 * The specific {@link DecoderValidator} type for a chain decoder.
 */
export type ChainDecoderType<
  Chain extends DecoderArray,
  Err extends DecoderError = ChainError<Chain>,
  Opts = ChainOptions<Chain>,
> = DecoderValidator<ChainOutput<Chain>, ChainInput<Chain>, Err, Opts>;

/**
 * Represents an object which can create a chain decoder with constrained input,
 * output and intermediate value types.
 */
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
  return validator((value, opts) => {
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
 */
export function chainType<
  Out,
  In = unknown,
  Middle = any,
>(): ChainDecoderFactory<Out, In, Middle> {
  return new Schema(chain as (...args: DecoderArray) => AnyDecoderValidator);
}
