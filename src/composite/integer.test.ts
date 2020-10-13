import 'jest';
import { assertCond } from '../internal/assertCond';
import { ExpectedInteger } from '../predicates/isInt';
import { ExpectedNumber } from '../primitives/number';
import { integer } from './integer';

describe('integer', () => {
  it('decodes an integer', () => {
    const result = integer(3);

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBe(3);
  });

  it('decodes the biggest possible integer', () => {
    const result = integer(Number.MAX_SAFE_INTEGER);

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBe(Number.MAX_SAFE_INTEGER);
  });

  it('decodes the smallest possible integer', () => {
    const result = integer(Number.MIN_SAFE_INTEGER);

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBe(Number.MIN_SAFE_INTEGER);
  });

  it('rejects a float', () => {
    const result = integer(3.14);

    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error[0].id).toBe(ExpectedInteger);
  });

  it('rejects an unsafe integer', () => {
    const result = integer(Number.MAX_SAFE_INTEGER + 1);

    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error[0].id).toBe(ExpectedInteger);
  });

  it('rejects an unsafe negative integer', () => {
    const result = integer(Number.MIN_SAFE_INTEGER - 1);

    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error[0].id).toBe(ExpectedInteger);
  });

  it('rejects a string', () => {
    const result = integer('3');

    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error[0].id).toBe(ExpectedNumber);
  });
});
