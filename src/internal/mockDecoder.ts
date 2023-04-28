import 'jest';
import { DecoderBase } from '../core/Decoder.js';
import { DecoderError } from '../core/DecoderError.js';
import { Result } from '../core/Result.js';

export class MockDecoder<
  Out = unknown,
  In = unknown,
  Err extends DecoderError = DecoderError,
  Opts = void,
> extends DecoderBase<Out, In, Err, Opts> {
  public readonly decode: jest.Mock<Result<Out, Err>, [value: In, opts?: Opts]>;

  constructor(decode: (value: In, opts?: Opts) => Result<Out, Err>) {
    super();
    this.decode = jest.fn(decode);
  }
}

export function mockDecoder(): MockDecoder;
export function mockDecoder<T, Opts = void>(
  value: T,
): MockDecoder<T, unknown, DecoderError, Opts>;
export function mockDecoder(value?: unknown): MockDecoder {
  return new MockDecoder((v) => ({
    ok: true,
    value: arguments.length > 0 ? value : v,
  })) as MockDecoder;
}

export function mockDecoderFn<Out, In>(
  fn: (value: In) => Result<Out>,
): MockDecoder<Out, In> {
  return new MockDecoder(fn);
}

export function mockFailDecoder(error: DecoderError | number): MockDecoder {
  return new MockDecoder(() => ({
    ok: false,
    error: typeof error === 'number' ? mockError(error) : error,
  }));
}

export function mockError(n: number): DecoderError {
  return { type: `FAIL${n}`, text: `text${n}` };
}
