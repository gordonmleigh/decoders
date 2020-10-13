import 'jest';
import { assertCond } from '../internal/assertCond';
import { trim } from './trim';

describe('trim', () => {
  it('strips whitespace from start and end of string input', () => {
    const result = trim(' \thello \nworld \t\r\n');

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBe('hello \nworld');
  });
});
