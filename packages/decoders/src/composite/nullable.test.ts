import 'jest';
import { assertCond } from '../internal/assertCond.js';
import { mockDecoderFn } from '../internal/testing/mockDecoder.js';
import { nullable } from './nullable.js';

describe('nullable', () => {
  it('passes through non-nulls to the inner decoder', () => {
    const value = Symbol();
    const inner = mockDecoderFn(() => ({ ok: true, value }));
    const decoder = nullable(inner);

    const input = Symbol();
    const result = decoder.decode(input);

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBe(value);

    expect(inner.decode).toHaveBeenCalledTimes(1);
    expect(inner.decode.mock.calls[0][0]).toBe(input);
  });

  it('passes through undefined to the inner decoder', () => {
    const value = Symbol();
    const inner = mockDecoderFn(() => ({ ok: true, value }));
    const decoder = nullable(inner);

    const result = decoder.decode(undefined);

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBe(value);

    expect(inner.decode).toHaveBeenCalledTimes(1);
    expect(inner.decode.mock.calls[0][0]).toBeUndefined();
  });

  it('decodes null without calling inner decoder', () => {
    const inner = mockDecoderFn((value) => ({
      ok: true,
      value,
    }));
    const decoder = nullable(inner);

    const result = decoder.decode(null);

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBe(null);

    expect(inner.decode).toHaveBeenCalledTimes(0);
  });
});
