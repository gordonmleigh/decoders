import 'jest';
import { assertCond } from '../internal/assertCond.js';
import { ExpectedString, string } from './string.js';

describe('date', () => {
  it('decodes a string', () => {
    const result = string.decode('hello world');
    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toEqual('hello world');
  });

  it('rejects numbers', () => {
    const result = string.decode(0);
    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error[0].id).toBe(ExpectedString);
  });
});
