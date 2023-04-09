import 'jest';
import { assertCond } from '../internal/assertCond.js';
import { ExpectedNumber } from '../primitives/number.js';
import { normaliseNumber } from './normaliseNumber.js';

describe('normaliseNumber', () => {
  it('it convers a string to a number', () => {
    const result = normaliseNumber.decode('42');

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBe(42);
  });

  it('it convers a string with decimal places to a number', () => {
    const result = normaliseNumber.decode('42.23');

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toEqual(42.23);
  });

  it('it rejects a non-numeric string', () => {
    const result = normaliseNumber.decode('42 grams');

    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error[0].type).toEqual(ExpectedNumber);
  });

  it('it accepts a number', () => {
    const result = normaliseNumber.decode(5);

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBe(5);
  });
});
