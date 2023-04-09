import 'jest';
import { assertCond } from '../internal/assertCond.js';
import { ConditionFailure } from './predicate.js';
import { regexp } from './regexp.js';

describe('predicate', () => {
  it('accepts values if the regexp matches', () => {
    const decoder = regexp(/^test$/);

    const result = decoder.decode('test');

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBe('test');
  });

  it('rejects values if the regexp does not match', () => {
    const decoder = regexp(/^nomatch$/);

    const result = decoder.decode('test');

    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error[0].type).toBe(ConditionFailure);
  });

  it('uses custom text and id if supplied', () => {
    const decoder = regexp(/^nomatch$/, 'text', 'FAIL');

    const result = decoder.decode('test');

    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error[0].type).toBe('FAIL');
    expect(result.error[0].text).toBe('text');
  });
});
