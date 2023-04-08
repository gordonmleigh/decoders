import 'jest';
import { assertCond } from '../internal/assertCond.js';
import { ExpectedDate } from '../primitives/date.js';
import { jsonDate } from './jsonDate.js';

describe('jsonDate', () => {
  it('decodes a date', () => {
    const result = jsonDate.decode(new Date(1602598990374));
    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toEqual(new Date(1602598990374));
  });

  it('decodes a string date', () => {
    const result = jsonDate.decode('2020-11-20T17:47:34.612Z');
    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toEqual(new Date('2020-11-20T17:47:34.612Z'));
  });

  it('rejects an invalid string', () => {
    const result = jsonDate.decode('fred');
    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error[0].id).toBe(ExpectedDate);
  });

  it('rejects numbers', () => {
    const result = jsonDate.decode(0);
    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error[0].id).toBe(ExpectedDate);
  });
});
