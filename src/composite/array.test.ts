import 'jest';
import { invalid, ok, Result } from '../core/Result';
import { assertCond } from '../internal/assertCond';
import { mockDecoder, mockDecoderFn } from '../internal/mockDecoder';
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

  it('fails if an element fails', () => {
    const elem = mockDecoderFn(
      (value): Result<number> =>
        typeof value === 'number' && value <= 3
          ? ok(value)
          : invalid('FAIL', 'fail'),
    );

    const decoder = array(elem);
    const input = [1, 2, 3, 4, 5];

    const result = decoder(input);

    expect(result.ok).toBe(false);

    assertCond(!result.ok);
    expect(result.error).toEqual([
      { id: 'FAIL', text: 'fail', field: '3' },
      { id: 'FAIL', text: 'fail', field: '4' },
    ]);

    expect(elem).toHaveBeenCalledTimes(5);
    expect(elem.mock.calls[0][0]).toBe(input[0]);
    expect(elem.mock.calls[1][0]).toBe(input[1]);
    expect(elem.mock.calls[2][0]).toBe(input[2]);
    expect(elem.mock.calls[3][0]).toBe(input[3]);
    expect(elem.mock.calls[4][0]).toBe(input[4]);
  });

  it('nests error fields properly', () => {
    const elem = mockDecoderFn(
      (value): Result<number> => invalid('FAIL', 'fail', 'field'),
    );

    const decoder = array(elem);
    const input = [1];

    const result = decoder(input);

    expect(result.ok).toBe(false);

    assertCond(!result.ok);
    expect(result.error).toEqual([
      { id: 'FAIL', text: 'fail', field: '0.field' },
    ]);

    expect(elem).toHaveBeenCalledTimes(1);
    expect(elem.mock.calls[0][0]).toBe(input[0]);
  });
});
