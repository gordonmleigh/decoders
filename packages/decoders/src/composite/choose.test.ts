import 'jest';
import { assertCond } from '../internal/assertCond.js';
import {
  mockDecoder,
  mockError,
  mockFailDecoder,
} from '../internal/testing/mockDecoder.js';
import { choose } from './choose.js';

describe('choose', () => {
  it('chooses from multiple decoders', () => {
    const input = Symbol();
    const value3 = Symbol();
    const value4 = Symbol();

    const decoder1 = mockFailDecoder(1);
    const decoder2 = mockFailDecoder(2);
    const decoder3 = mockDecoder(value3);
    const decoder4 = mockDecoder(value4);

    const decoder = choose(decoder1, decoder2, decoder3, decoder4);

    const result = decoder.decode(input);

    expect(result.ok).toBe(true);
    assertCond(result.ok);

    expect(result.value).toBe(value3);

    expect(decoder1.decode).toHaveBeenCalledTimes(1);
    expect(decoder1.decode.mock.calls[0][0]).toBe(input);

    expect(decoder2.decode).toHaveBeenCalledTimes(1);
    expect(decoder2.decode.mock.calls[0][0]).toBe(input);

    expect(decoder3.decode).toHaveBeenCalledTimes(1);
    expect(decoder3.decode.mock.calls[0][0]).toBe(input);

    expect(decoder4.decode).toHaveBeenCalledTimes(0);
  });

  it('combines all errors on failure', () => {
    const input = Symbol();

    const decoder1 = mockFailDecoder(1);
    const decoder2 = mockFailDecoder(2);
    const decoder3 = mockFailDecoder(3);

    const decoder = choose(decoder1, decoder2, decoder3);

    const result = decoder.decode(input);

    expect(result.ok).toBe(false);
    assertCond(!result.ok);

    expect(result.error).toEqual({
      type: 'composite:choose',
      text: 'failed to match one of',
      choose: [mockError(1), mockError(2), mockError(3)],
    });

    expect(decoder1.decode).toHaveBeenCalledTimes(1);
    expect(decoder1.decode.mock.calls[0][0]).toBe(input);

    expect(decoder2.decode).toHaveBeenCalledTimes(1);
    expect(decoder2.decode.mock.calls[0][0]).toBe(input);

    expect(decoder3.decode).toHaveBeenCalledTimes(1);
    expect(decoder3.decode.mock.calls[0][0]).toBe(input);
  });
});
