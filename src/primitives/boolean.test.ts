import 'jest';
import { assertCond } from '../internal/assertCond.js';
import { boolean, ExpectedBoolean } from './boolean.js';

describe('boolean', () => {
  it('decodes true', () => {
    const result = boolean.decode(true);
    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBe(true);
  });

  it('decodes false', () => {
    const result = boolean.decode(false);
    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBe(false);
  });

  it('rejects numbers', () => {
    const result = boolean.decode(0);
    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error[0].id).toBe(ExpectedBoolean);
  });
});
