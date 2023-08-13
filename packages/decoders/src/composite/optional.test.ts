import 'jest';
import { assertCond } from '../internal/assertCond.js';
import { mockDecoder } from '../internal/testing/mockDecoder.js';
import { optional } from './optional.js';

describe('optional', () => {
  it('passes through non-undefined values to the inner decoder', () => {
    const value = Symbol();
    const inner = mockDecoder(value);
    const decoder = optional(inner);

    const input = Symbol();
    const result = decoder.decode(input);

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBe(value);

    expect(inner.decode).toHaveBeenCalledTimes(1);
    expect(inner.decode.mock.calls[0][0]).toBe(input);
  });

  it('passes through null to the inner decoder', () => {
    const value = Symbol();
    const inner = mockDecoder(value);
    const decoder = optional(inner);

    const result = decoder.decode(null);

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBe(value);

    expect(inner.decode).toHaveBeenCalledTimes(1);
    expect(inner.decode.mock.calls[0][0]).toBe(null);
  });

  it('decodes undefined without calling inner decoder', () => {
    const inner = mockDecoder();
    const decoder = optional(inner);

    const result = decoder.decode(undefined);

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBeUndefined();

    expect(inner.decode).toHaveBeenCalledTimes(0);
  });
});
