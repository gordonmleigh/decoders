import 'jest';
import { assertCond } from '../internal/assertCond.js';
import { mockDecoder } from '../internal/mockDecoder.js';
import { maybe } from './maybe.js';

describe('maybe', () => {
  it('accepts an empty string and converts to undefined', () => {
    const inner = mockDecoder();
    const decoder = maybe(inner);

    const result = decoder.decode('');

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBeUndefined();

    expect(inner.decode).toHaveBeenCalledTimes(0);
  });

  it('accepts null and converts to undefined', () => {
    const inner = mockDecoder();
    const decoder = maybe(inner);

    const result = decoder.decode(null);

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBeUndefined();

    expect(inner.decode).toHaveBeenCalledTimes(0);
  });

  it('accepts undefined', () => {
    const inner = mockDecoder();
    const decoder = maybe(inner);

    const result = decoder.decode(undefined);

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBeUndefined();

    expect(inner.decode).toHaveBeenCalledTimes(0);
  });

  it('passes through 0 to inner decoder', () => {
    const inner = mockDecoder();
    const decoder = maybe(inner);

    const result = decoder.decode(0);

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBe(0);

    expect(inner.decode).toHaveBeenCalledTimes(1);
    expect(inner.mock.calls[0][0]).toBe(0);
  });

  it('passes through false to inner decoder', () => {
    const inner = mockDecoder();
    const decoder = maybe(inner);

    const result = decoder.decode(false);

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBe(false);

    expect(inner.decode).toHaveBeenCalledTimes(1);
    expect(inner.mock.calls[0][0]).toBe(false);
  });

  it('converts empty string from inner decoder to undefined', () => {
    const inner = mockDecoder('');
    const decoder = maybe(inner);

    const result = decoder.decode('value');

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBeUndefined();

    expect(inner.decode).toHaveBeenCalledTimes(1);
    expect(inner.mock.calls[0][0]).toBe('value');
  });

  it('converts null from inner decoder to undefined', () => {
    const inner = mockDecoder(null);
    const decoder = maybe(inner);
    const result = decoder.decode('value');

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBeUndefined();

    expect(inner.decode).toHaveBeenCalledTimes(1);
    expect(inner.mock.calls[0][0]).toBe('value');
  });
});
