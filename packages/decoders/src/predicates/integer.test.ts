import 'jest';
import { assertCond } from '../internal/assertCond.js';
import { integer } from './integer.js';

describe('integer', () => {
  it('decodes an integer', () => {
    const result = integer.decode(3);

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBe(3);
  });

  it('decodes the biggest possible integer', () => {
    const result = integer.decode(Number.MAX_SAFE_INTEGER);

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBe(Number.MAX_SAFE_INTEGER);
  });

  it('decodes the smallest possible integer', () => {
    const result = integer.decode(Number.MIN_SAFE_INTEGER);

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBe(Number.MIN_SAFE_INTEGER);
  });

  it('rejects a float', () => {
    const result = integer.decode(3.14);

    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error.type).toBe('value:integer');
  });

  it('rejects an unsafe integer', () => {
    const result = integer.decode(Number.MAX_SAFE_INTEGER + 1);

    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error.type).toBe('value:integer');
  });

  it('rejects an unsafe negative integer', () => {
    const result = integer.decode(Number.MIN_SAFE_INTEGER - 1);

    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error.type).toBe('value:integer');
  });
});
