import 'jest';
import { invalid, ok, Result } from '../core/Result.js';
import { assertCond } from '../internal/assertCond.js';
import { mockDecoder, mockDecoderFn } from '../internal/testing/mockDecoder.js';
import { array } from './array.js';

describe('array', () => {
  it('decodes an array', () => {
    const elem = mockDecoder();

    const decoder = array(elem);
    const input = [Symbol(), Symbol()];

    const result = decoder.decode(input);

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toEqual(input);

    expect(elem.decode).toHaveBeenCalledTimes(2);
    expect(elem.decode.mock.calls[0][0]).toBe(input[0]);
    expect(elem.decode.mock.calls[1][0]).toBe(input[1]);
  });

  it('fails if an element fails', () => {
    const elem = mockDecoderFn(
      (value): Result<number> =>
        typeof value === 'number' && value <= 3
          ? ok(value)
          : invalid('FAIL', 'fail'),
    );

    const decoder = array(elem);
    const input = [1, 2, 3, 4, 5];

    const result = decoder.decode(input);

    expect(result.ok).toBe(false);

    assertCond(!result.ok);
    expect(result.error).toEqual({
      type: 'composite:array',
      text: 'invalid elements',
      elements: {
        [3]: { type: 'FAIL', text: 'fail' },
        [4]: { type: 'FAIL', text: 'fail' },
      },
    });

    expect(elem.decode).toHaveBeenCalledTimes(5);
    expect(elem.decode.mock.calls[0][0]).toBe(input[0]);
    expect(elem.decode.mock.calls[1][0]).toBe(input[1]);
    expect(elem.decode.mock.calls[2][0]).toBe(input[2]);
    expect(elem.decode.mock.calls[3][0]).toBe(input[3]);
    expect(elem.decode.mock.calls[4][0]).toBe(input[4]);
  });
});
