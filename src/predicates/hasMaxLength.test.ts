import 'jest';
import { assertCond } from '../internal/assertCond';
import { ExpectedStringMaxLength, hasMaxLength } from './hasMaxLength';

describe('hasMaxLength', () => {
  it('decodes a string shorter than max length', () => {
    const decoder = hasMaxLength(10);
    const result = decoder('hello');

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toEqual('hello');
  });

  it('decodes a string equal to max length', () => {
    const decoder = hasMaxLength(5);
    const result = decoder('hello');

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toEqual('hello');
  });

  it('rejects a string greater than max length', () => {
    const decoder = hasMaxLength(2);
    const result = decoder('hello');

    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error[0].id).toBe(ExpectedStringMaxLength);
  });
});
