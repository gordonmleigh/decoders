import 'jest';
import { assertCond } from '../internal/assertCond.js';
import { is } from './is.js';

describe('is', () => {
  it('decodes a specific value', () => {
    const decoder = is('hello world');
    const result = decoder.decode('hello world');
    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toEqual('hello world');
  });

  it('matches values using strict comparison', () => {
    const decoder = is(null);
    const result = decoder.decode(undefined);
    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error.type).toEqual('value:is');
  });

  it('matches NaN', () => {
    const decoder = is(0 / 0);
    const result = decoder.decode(0 / 0);
    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBeNaN();
  });

  it('rejects a non-matching value', () => {
    const decoder = is(1, 2, 3);
    const result = decoder.decode(0);
    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error.type).toEqual('value:is');
    expect(result.error.options).toEqual([1, 2, 3]);
  });
});
