import 'jest';
import { assertCond } from '../internal/assertCond';
import { number } from '../primitives/number';
import { record } from './record';
import { text } from './text';

describe('record', () => {
  it('can decode a record', () => {
    // integration test
    const decoder = record(text, number);

    const result = decoder({
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
