import 'jest';
import { Decoder } from '../core/Decoder.js';
import { DecoderError } from '../core/DecoderError.js';
import { DecoderOptions } from '../core/DecoderOptions.js';
import { Result } from '../core/Result.js';

class MockDecoder<Out = unknown, In = unknown> implements Decoder<Out, In> {
  public readonly decode: jest.Mock<
    Result<Out>,
    [value: In, opts?: DecoderOptions | undefined]
  >;

  public get mock(): (typeof this.decode)['mock'] {
    return this.decode.mock;
  }

  constructor(decode: Decoder<Out, In>['decode']) {
    this.decode = jest.fn(decode);
  }
}

export function mockDecoder(): MockDecoder;
export function mockDecoder<T>(value: T): MockDecoder<T>;
export function mockDecoder(value?: unknown): MockDecoder {
  return new MockDecoder((v) => ({
    ok: true,
    value: arguments.length > 0 ? value : v,
  }));
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
