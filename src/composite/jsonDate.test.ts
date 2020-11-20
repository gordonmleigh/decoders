import 'jest';
import { assertCond } from '../internal/assertCond';
import { ExpectedDate } from '../primitives/date';
import { jsonDate } from './jsonDate';

describe('jsonDate', () => {
  it('decodes a date', () => {
    const result = jsonDate(new Date(1602598990374));
    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toEqual(new Date(1602598990374));
  });

  it('decodes a string date', () => {
    const result = jsonDate('2020-11-20T17:47:34.612Z');
    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toEqual(new Date('2020-11-20T17:47:34.612Z'));
  });

  it('rejects an invalid string', () => {
    const result = jsonDate('fred');
    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error[0].id).toBe(ExpectedDate);
  });

  it('rejects numbers', () => {
    const result = jsonDate(0);
    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error[0].id).toBe(ExpectedDate);
  });
});
