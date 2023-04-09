import 'jest';
import { assertCond } from '../internal/assertCond.js';
import { mockDecoder, mockFailDecoder } from '../internal/mockDecoder.js';
import { chain } from './chain.js';

describe('chain', () => {
  it('composes multiple decoders', () => {
    const input = Symbol();
    const value1 = Symbol();
    const value2 = Symbol();
    const value3 = Symbol();

    const decoder1 = mockDecoder(value1);
    const decoder2 = mockDecoder(value2);
    const decoder3 = mockDecoder(value3);

    const decoder = chain(decoder1, decoder2, decoder3);

    const result = decoder.decode(input);

    expect(result.ok).toBe(true);
    assertCond(result.ok);

    expect(result.value).toBe(value3);

    expect(decoder1.decode).toHaveBeenCalledTimes(1);
    expect(decoder1.mock.calls[0][0]).toBe(input);

    expect(decoder2.decode).toHaveBeenCalledTimes(1);
    expect(decoder2.mock.calls[0][0]).toBe(value1);

    expect(decoder3.decode).toHaveBeenCalledTimes(1);
    expect(decoder3.mock.calls[0][0]).toBe(value2);
  });

  it('fails on first error', () => {
    const input = Symbol();
    const value1 = Symbol();
    const value3 = Symbol();

    const decoder1 = mockDecoder(value1);
    const decoder2 = mockFailDecoder({
      type: 'FAIL',
      text: 'failed',
      field: 'somefield',
    });
    const decoder3 = mockDecoder(value3);

    const decoder = chain(decoder1, decoder2, decoder3);

    const result = decoder.decode(input);

    expect(result.ok).toBe(false);
    assertCond(!result.ok);

    expect(result.error).toEqual([
      { type: 'FAIL', text: 'failed', field: 'somefield' },
    ]);

    expect(decoder1.decode).toHaveBeenCalledTimes(1);
    expect(decoder1.mock.calls[0][0]).toBe(input);

    expect(decoder2.decode).toHaveBeenCalledTimes(1);
    expect(decoder2.mock.calls[0][0]).toBe(value1);

    expect(decoder3.decode).toHaveBeenCalledTimes(0);
  });
});
