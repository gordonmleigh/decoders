import 'jest';
import { assertCond } from '../internal/assertCond';
import { mockDecoder, mockFailDecoder } from '../internal/mockDecoder';
import { DecodingAssertError } from './DecodingAssertError';
import { makeAssertDecoder } from './makeAssertDecoder';

describe('makeAssertDecpder', () => {
  it('creates an AssertDecoder that calls the original decoder', () => {
    const value = Symbol();
    const decoder = mockDecoder(value);
    const asserter = makeAssertDecoder(decoder);

    const input = Symbol();
    const result = asserter(input);

    expect(result).toBe(value);
    expect(decoder).toHaveBeenCalledTimes(1);
    expect(decoder.mock.calls[0][0]).toBe(input);
  });

  it('creates an AssertDecoder which throws DecodingAssertError on failure', () => {
    const decoder = mockFailDecoder(1);
    const asserter = makeAssertDecoder(decoder);

    const input = Symbol();

    let thrownError: unknown;
    try {
      asserter(input);
    } catch (err) {
      thrownError = err;
    }

    expect(thrownError).toBeInstanceOf(DecodingAssertError);
    assertCond(thrownError instanceof DecodingAssertError);
    expect(thrownError.errors).toEqual([
      { id: 'FAIL1', text: 'text1', field: 'field1' },
    ]);
  });
});
