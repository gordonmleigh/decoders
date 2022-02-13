import 'jest';
import { Decoder } from '../core/Decoder.js';
import { assertCond } from '../internal/assertCond.js';
import { nullable } from './nullable.js';

describe('nullable', () => {
  it('passes through non-nulls to the inner decoder', () => {
    const value = Symbol();
    const inner = jest.fn((() => ({ ok: true, value })) as Decoder<unknown>);
    const decoder = nullable(inner);

    const input = Symbol();
    const result = decoder(input);

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBe(value);

    expect(inner).toHaveBeenCalledTimes(1);
    expect(inner.mock.calls[0][0]).toBe(input);
  });

  it('passes through undefined to the inner decoder', () => {
    const value = Symbol();
    const inner = jest.fn((() => ({ ok: true, value })) as Decoder<unknown>);
    const decoder = nullable(inner);

    const result = decoder(undefined);

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBe(value);

    expect(inner).toHaveBeenCalledTimes(1);
    expect(inner.mock.calls[0][0]).toBeUndefined();
  });

  it('decodes null without calling inner decoder', () => {
    const inner = jest.fn(((value) => ({ ok: true, value })) as Decoder<
      unknown
    >);
    const decoder = nullable(inner);

    const result = decoder(null);

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBe(null);

    expect(inner).toHaveBeenCalledTimes(0);
  });
});
