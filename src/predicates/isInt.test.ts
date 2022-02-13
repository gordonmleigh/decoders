import 'jest';
import { assertCond } from '../internal/assertCond.js';
import { ExpectedInteger } from '../predicates/isInt.js';
import { isInt } from './isInt.js';

describe('integer', () => {
  it('decodes an integer', () => {
    const result = isInt(3);

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBe(3);
  });

  it('decodes the biggest possible integer', () => {
    const result = isInt(Number.MAX_SAFE_INTEGER);

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBe(Number.MAX_SAFE_INTEGER);
  });

  it('decodes the smallest possible integer', () => {
    const result = isInt(Number.MIN_SAFE_INTEGER);

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBe(Number.MIN_SAFE_INTEGER);
  });

  it('rejects a float', () => {
    const result = isInt(3.14);

    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error[0].id).toBe(ExpectedInteger);
  });

  it('rejects an unsafe integer', () => {
    const result = isInt(Number.MAX_SAFE_INTEGER + 1);

    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error[0].id).toBe(ExpectedInteger);
  });

  it('rejects an unsafe negative integer', () => {
    const result = isInt(Number.MIN_SAFE_INTEGER - 1);

    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error[0].id).toBe(ExpectedInteger);
  });
});
