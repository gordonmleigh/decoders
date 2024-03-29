import 'jest';
import { assertCond } from '../internal/assertCond.js';
import {
  mockDecoder,
  mockFailDecoder,
} from '../internal/testing/mockDecoder.js';
import { DecodingAssertError } from './DecodingAssertError.js';
import { assert } from './assert.js';

describe('assert', () => {
  it('calls the original decoder', () => {
    const value = Symbol();
    const decoder = mockDecoder(value);

    const input = Symbol();
    const result = assert(decoder, input);

    expect(result).toBe(value);
    expect(decoder.decode).toHaveBeenCalledTimes(1);
    expect(decoder.decode.mock.calls[0][0]).toBe(input);
  });

  it('it throws DecodingAssertError on failure', () => {
    const decoder = mockFailDecoder(1);
    const input = Symbol();

    let thrownError: unknown;
    try {
      assert(decoder, input);
    } catch (err) {
      thrownError = err;
    }

    expect(thrownError).toBeInstanceOf(DecodingAssertError);
    assertCond(thrownError instanceof DecodingAssertError);
    expect(thrownError.error).toEqual({ type: 'FAIL1', text: 'text1' });
  });
});
