import {
  Decoder,
  DecoderBase,
  DecoderFactoryFunction,
  DecoderFunction,
} from './Decoder.js';
import { DecoderError } from './DecoderError.js';
import { Result } from './Result.js';

// eslint-disable-next-line @typescript-eslint/ban-types
type Empty = {};

type DecoderValidatorExtra<Out extends In, In = unknown, Opts = void> = {
  /**
   * Test if a value matches.
   *
   * @param value The value to test
   * @param opts The options for the decoder
   * @returns true if the value matches, false otherwise
   */
  test(value: In, opts?: Opts): value is Out;
};

/**
 * Represents an object which can decode a value.
 *
 * @template Out The output value type.
 * @template In The input value type.
 */
export type DecoderValidator<
  Out extends In,
  In = unknown,
  Err extends DecoderError = DecoderError,
  Opts = void,
  Extra = Empty,
> = Decoder<Out, In, Err, Opts, DecoderValidatorExtra<Out, In, Opts> & Extra>;

/**
 * Represents a function that can decode a value.
 */
export type DecoderValidatorFunction<
  Out extends In,
  In = unknown,
  Err extends DecoderError = DecoderError,
  Opts = unknown,
> = DecoderValidator<Out, In, Err, Opts>['decode'];

/**
 * Represents a {@link DecoderValidator} with any parameters.
 */
export type AnyDecoderValidator<
  Out extends In = any,
  In = any,
  Err extends DecoderError = any,
  Opts = any,
> = DecoderValidator<Out, In, Err, Opts>;

/**
 * Represents an array of {@link DecoderValidator}s with any parameters.
 */
export type DecoderValidatorArray<
  Out extends In = any,
  In = any,
  Err extends DecoderError = any,
  Opts = any,
> = DecoderValidator<Out, In, Err, Opts>[];

/**
 * Create a custom {@link DecoderValidator} from a {@link DecoderFunction}.
 */
export function validator<
  Out extends In,
  In = unknown,
  Err extends DecoderError = DecoderError,
  Opts = unknown,
>(
  decode: DecoderFunction<Out, In, Err, Opts>,
): DecoderValidator<Out, In, Err, Opts> {
  return new DecoderValidatorLambda(decode);
}

export type DecoderValidatorFactoryFunction<Extra> = <
  Out extends In,
  In,
  Err extends DecoderError,
  Opts,
>(
  decoder: DecoderValidatorFunction<Out, In, Err, Opts>,
) => DecoderValidator<Out, In, Err, Opts, Extra>;

/**
 * A base class for {@link DecoderValidator} implementations.
 */
export abstract class DecoderValidatorBase<
    Out extends In,
    In = unknown,
    Err extends DecoderError = DecoderError,
    Opts = void,
    Extra = Empty,
  >
  extends DecoderBase<
    Out,
    In,
    Err,
    Opts,
    DecoderValidatorExtra<Out, In, Opts> & Extra
  >
  implements DecoderValidator<Out, In, Err, Opts, Extra>
{
  constructor(
    factory: DecoderValidatorFactoryFunction<Extra> = (fn) =>
      new DecoderValidatorLambda(fn),
  ) {
    // need to assert here because of the added generic constraint
    super(factory as DecoderFactoryFunction<Extra>);
  }

  public test(value: In, opts?: Opts | undefined): value is Out {
    return this.decode(value, opts).ok;
  }
}

class DecoderValidatorLambda<
  Out extends In,
  In,
  Err extends DecoderError,
  Opts,
> extends DecoderValidatorBase<Out, In, Err, Opts> {
  constructor(private readonly _decode: DecoderFunction<Out, In, Err, Opts>) {
    super();
  }

  public decode(value: In, opts?: Opts | undefined): Result<Out, Err> {
    return this._decode(value, opts);
  }
}
