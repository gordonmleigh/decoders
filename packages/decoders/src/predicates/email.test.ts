import 'jest';
import { assertCond } from '../internal/assertCond.js';
import { email } from './email.js';

describe('isEmail', () => {
  it('accepts a common email format', () => {
    const result = email.decode('gordon.leigh.101@example.com');

    expect(result).toEqual({
      ok: true,
      value: 'gordon.leigh.101@example.com',
    });
  });

  it('accepts plus addressing', () => {
    const result = email.decode('gordon.leigh+some.other.stuff9@example.com');

    expect(result).toEqual({
      ok: true,
      value: 'gordon.leigh+some.other.stuff9@example.com',
    });
  });

  it('accepts emails on TLDs', () => {
    const result = email.decode('g@example');

    expect(result).toEqual({
      ok: true,
      value: 'g@example',
    });
  });

  it('rejects a comma in the domain', () => {
    const result = email.decode('gordon.leigh.101@example,com');

    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error.type).toEqual('value:email');
  });

  it('rejects a space in the domain', () => {
    const result = email.decode('gordon.leigh.101@ example.com');

    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error.type).toEqual('value:email');
  });

  it('rejects a space in the user part', () => {
    const result = email.decode('gordon leigh@example.com');

    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error.type).toEqual('value:email');
  });

  it('rejects multiple at symbols', () => {
    const result = email.decode('gordon@leigh@example.com');

    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error.type).toEqual('value:email');
  });

  it('rejects zero at symbols', () => {
    const result = email.decode('example.com');

    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error.type).toEqual('value:email');
  });
});
