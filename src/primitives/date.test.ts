import 'jest';
import { assertCond } from '../internal/assertCond';
import { date, ExpectedDate } from './date';

describe('date', () => {
  it('decodes a date', () => {
    const result = date(new Date(1602598990374));
    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toEqual(new Date(1602598990374));
  });

  it('rejects numbers', () => {
    const result = date(0);
    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error[0].id).toBe(ExpectedDate);
  });
});
