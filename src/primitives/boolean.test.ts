import 'jest';
import { assertCond } from '../internal/assertCond';
import { boolean, ExpectedBoolean } from './boolean';

describe('boolean', () => {
  it('decodes true', () => {
    const result = boolean(true);
    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBe(true);
  });

  it('decodes false', () => {
    const result = boolean(false);
    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBe(false);
  });

  it('rejects numbers', () => {
    const result = boolean(0);
    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error[0].id).toBe(ExpectedBoolean);
  });
});
