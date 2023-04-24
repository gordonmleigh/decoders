import {
  AnyDecoder,
  Decoder,
  ErrorType,
  InputType,
  OptionsType,
  OutputType,
} from '../core/Decoder.js';
import { DecoderError } from '../core/DecoderError.js';
import { Result } from '../core/Result.js';

export type DecoderWithError<
  Input extends AnyDecoder,
  Err extends DecoderError,
> = Decoder<OutputType<Input>, InputType<Input>, Err, OptionsType<Input>>;

export interface WithErrorFn<Input extends AnyDecoder> {
  /**
   * Return a new decoder that returns the given error on failure instead of the
   * default one.
   */
  <T extends string>(error: T, text: string): DecoderWithError<
    Input,
    DecoderError<T>
  >;
  /**
   * Return a new decoder that returns the given error on failure instead of the
   * default one.
   */
  <Err extends DecoderError>(error: Err): DecoderWithError<Input, Err>;
  /**
   * Return a new decoder that returns the given error on failure instead of the
   * default one.
   */
  <Err extends DecoderError>(
    error: (err: ErrorType<Input>) => Err,
  ): DecoderWithError<Input, Err>;
}

export function withError<Input extends AnyDecoder>(
  input: Input,
): { map: WithErrorFn<Input> } {
  return {
    map: (err: any, text?: any) => new WithErrorWrapper(input, err, text),
  };
}

class WithErrorWrapper<Input extends AnyDecoder, Err extends DecoderError>
  implements DecoderWithError<Input, Err>
{
  private readonly mapError: (err: ErrorType<Input>) => Err;

  constructor(wrapped: Input, error: string, text: string);
  constructor(wrapped: Input, error: Err);
  constructor(wrapped: Input, error: (err: ErrorType<Input>) => Err);
  constructor(
    private readonly wrapped: Input,
    error: string | DecoderError | ((err: ErrorType<Input>) => Err),
    text?: string,
  ) {
    if (typeof error === 'function') {
      this.mapError = error;
    } else if (typeof error === 'string') {
      this.mapError = (): any => ({
        type: error,
        text: text as string,
      });
    } else {
      this.mapError = (): any => error;
    }
  }

  public decode(
    value: InputType<Input>,
    opts?: OptionsType<Input>,
  ): Result<OutputType<Input>, Err> {
    const result = this.wrapped.decode(value, opts);
    if (!result.ok) {
      return {
        ok: false,
        error: this.mapError(result.error),
      };
    }
    return result;
  }
}
