import 'jest';
import { assertCond } from '../internal/assertCond';
import { ExpectedStringMinLength, hasMinLength } from './hasMinLength';

describe('hasMinLength', () => {
  it('decodes a string greater than min length', () => {
    const decoder = hasMinLength(3);
    const result = decoder('hello');

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toEqual('hello');
  });

  it('decodes a string equal to min length', () => {
    const decoder = hasMinLength(5);
    const result = decoder('hello');

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toEqual('hello');
  });

  it('rejects a string shorter than min length', () => {
    const decoder = hasMinLength(10);
    const result = decoder('hello');

    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error[0].id).toBe(ExpectedStringMinLength);
    expect(result.error[0].details).toEqual({ minLength: 10 });
  });
});
