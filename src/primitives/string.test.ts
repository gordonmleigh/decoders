import 'jest';
import { assertCond } from '../internal/assertCond';
import { ExpectedString, string } from './string';

describe('date', () => {
  it('decodes a string', () => {
    const result = string('hello world');
    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toEqual('hello world');
  });

  it('rejects numbers', () => {
    const result = string(0);
    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error[0].id).toBe(ExpectedString);
  });
});
