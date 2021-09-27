import 'jest';
import { assertCond } from '../internal/assertCond';
import { ExpectedSpecificValue, is } from './is';

describe('is', () => {
  it('decodes a specific value', () => {
    const decoder = is('hello world');
    const result = decoder('hello world');
    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toEqual('hello world');
  });

  it('matches values using strict comparison', () => {
    const decoder = is(null);
    const result = decoder(undefined);
    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error[0].id).toEqual(ExpectedSpecificValue);
  });

  it('matches NaN', () => {
    const decoder = is(0 / 0);
    const result = decoder(0 / 0);
    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBeNaN();
  });

  it('rejects a non-matching value', () => {
    const decoder = is(1, 2, 3);
    const result = decoder(0);
    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error[0].id).toEqual(ExpectedSpecificValue);
    expect(result.error[0].details?.options).toEqual([1, 2, 3]);
  });
});
