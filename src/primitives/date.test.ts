import 'jest';
import { assertCond } from '../internal/assertCond.js';
import { date, ExpectedDate } from './date.js';

describe('date', () => {
  it('decodes a date', () => {
    const result = date.decode(new Date(1602598990374));
    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toEqual(new Date(1602598990374));
  });

  it('rejects numbers', () => {
    const result = date.decode(0);
    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error[0].id).toBe(ExpectedDate);
  });
});
