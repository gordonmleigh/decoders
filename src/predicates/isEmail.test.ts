import 'jest';
import { assertCond } from '../internal/assertCond.js';
import { ExpectedEmail, isEmail } from './isEmail.js';

describe('emisEmailail', () => {
  it('accepts a common email format', () => {
    const result = isEmail('gordon.leigh.101@example.com');

    expect(result).toEqual({
      ok: true,
      value: 'gordon.leigh.101@example.com',
    });
  });

  it('accepts plus addressing', () => {
    const result = isEmail('gordon.leigh+some.other.stuff9@example.com');

    expect(result).toEqual({
      ok: true,
      value: 'gordon.leigh+some.other.stuff9@example.com',
    });
  });

  it('accepts emails on TLDs', () => {
    const result = isEmail('g@example');

    expect(result).toEqual({
      ok: true,
      value: 'g@example',
    });
  });

  it('rejects a comma in the domain', () => {
    const result = isEmail('gordon.leigh.101@example,com');

    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error[0].id).toEqual(ExpectedEmail);
  });

  it('rejects a space in the domain', () => {
    const result = isEmail('gordon.leigh.101@ example.com');

    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error[0].id).toEqual(ExpectedEmail);
  });

  it('rejects a space in the user part', () => {
    const result = isEmail('gordon leigh@example.com');

    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error[0].id).toEqual(ExpectedEmail);
  });

  it('rejects multiple at symbols', () => {
    const result = isEmail('gordon@leigh@example.com');

    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error[0].id).toEqual(ExpectedEmail);
  });

  it('rejects zero at symbols', () => {
    const result = isEmail('example.com');

    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error[0].id).toEqual(ExpectedEmail);
  });
});
