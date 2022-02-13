import 'jest';
import { assertCond } from '../internal/assertCond.js';
import { mockDecoder } from '../internal/mockDecoder.js';
import { optional } from './optional.js';

describe('optional', () => {
  it('passes through non-undefined values to the inner decoder', () => {
    const value = Symbol();
    const inner = mockDecoder(value);
    const decoder = optional(inner);

    const input = Symbol();
    const result = decoder(input);

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBe(value);

    expect(inner).toHaveBeenCalledTimes(1);
    expect(inner.mock.calls[0][0]).toBe(input);
  });

  it('passes through null to the inner decoder', () => {
    const value = Symbol();
    const inner = mockDecoder(value);
    const decoder = optional(inner);

    const result = decoder(null);

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBe(value);

    expect(inner).toHaveBeenCalledTimes(1);
    expect(inner.mock.calls[0][0]).toBe(null);
  });

  it('decodes undefined without calling inner decoder', () => {
    const inner = mockDecoder();
    const decoder = optional(inner);

    const result = decoder(undefined);

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBeUndefined();

    expect(inner).toHaveBeenCalledTimes(0);
  });
});
