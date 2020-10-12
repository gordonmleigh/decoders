import 'jest';
import { Decoder } from '../core/Decoder';
import { assertCond } from '../internal/assertCond';
import { array } from './array';

describe('array', () => {
  it('decodes an array', () => {
    const elem = jest.fn(((x) => ({
      ok: true,
      value: x,
    })) as Decoder<unknown>);

    const decoder = array(elem);
    const input = [{}, {}];

    const result = decoder(input);

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toEqual(input);

    expect(elem).toHaveBeenCalledTimes(2);
    expect(elem.mock.calls[0][0]).toBe(input[0]);
    expect(elem.mock.calls[1][0]).toBe(input[1]);
  });
});
