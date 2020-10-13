import 'jest';
import { assertCond } from '../internal/assertCond';
import { mockDecoder } from '../internal/mockDecoder';
import { array } from './array';

describe('array', () => {
  it('decodes an array', () => {
    const elem = mockDecoder();

    const decoder = array(elem);
    const input = [Symbol(), Symbol()];

    const result = decoder(input);

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toEqual(input);

    expect(elem).toHaveBeenCalledTimes(2);
    expect(elem.mock.calls[0][0]).toBe(input[0]);
    expect(elem.mock.calls[1][0]).toBe(input[1]);
  });
});
