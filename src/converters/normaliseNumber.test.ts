import 'jest';
import { assertCond } from '../internal/assertCond';
import { ExpectedNumber } from '../primitives/number';
import { normaliseNumber } from './normaliseNumber';

describe('normaliseNumber', () => {
  it('it convers a string to a number', () => {
    const result = normaliseNumber('42');

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBe(42);
  });

  it('it convers a string with decimal places to a number', () => {
    const result = normaliseNumber('42.23');

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toEqual(42.23);
  });

  it('it rejects a non-numeric string', () => {
    const result = normaliseNumber('42 grams');

    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error[0].id).toEqual(ExpectedNumber);
  });

  it('it accepts a number', () => {
    const result = normaliseNumber(5);

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBe(5);
  });
});
