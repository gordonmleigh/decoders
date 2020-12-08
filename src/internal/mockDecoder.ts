import 'jest';
import { DecoderError } from '../core/DecoderError';
import { Result } from '../core/Result';

export function mockDecoder(): jest.Mock<Result<unknown>, [unknown]>;
export function mockDecoder<T>(value: T): jest.Mock<Result<T>, [unknown]>;
export function mockDecoder(
  value?: unknown,
): jest.Mock<Result<unknown>, [unknown]> {
  return jest.fn((v) => ({
    ok: true,
    value: arguments.length > 0 ? value : v,
  }));
}

export function mockDecoderFn<V, T>(
  fn: (value: V) => Result<T>,
): jest.Mock<Result<T>, [V]> {
  return jest.fn(fn);
}

export function mockFailDecoder(
  ...error: (DecoderError | number)[]
): jest.Mock<Result<unknown>, [unknown]> {
  return jest.fn((v) => ({
    ok: false,
    error: error.map((x) => (typeof x === 'number' ? mockError(x) : x)),
  }));
}

export function mockError(n: number): DecoderError {
  return { id: `FAIL${n}`, text: `text${n}`, field: `field${n}` };
}
