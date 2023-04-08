import 'jest';
import { assertCond } from '../internal/assertCond.js';
import { number } from '../primitives/number.js';
import { record } from './record.js';
import { text } from './text.js';

describe('record', () => {
  it('can decode a record', () => {
    // integration test
    const decoder = record(text, number);

    const result = decoder.decode({
      one: 1,
      two: 2,
    });

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toEqual({
      one: 1,
      two: 2,
    });
  });
});
