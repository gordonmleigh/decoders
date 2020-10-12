import 'jest';
import { Decoder } from '../core/Decoder';
import { assertCond } from '../internal/assertCond';
import { chain } from './chain';

describe('chain', () => {
  it('composes multiple decoders', () => {
    const input = {};
    const value1 = {};
    const value2 = {};
    const value3 = {};

    const decoder1 = jest.fn(((x) => ({
      ok: true,
      value: value1,
    })) as Decoder<unknown>);

    const decoder2 = jest.fn(((x) => ({
      ok: true,
      value: value2,
    })) as Decoder<unknown>);

    const decoder3 = jest.fn(((x) => ({
      ok: true,
      value: value3,
    })) as Decoder<unknown>);

    const decoder = chain(decoder1, decoder2, decoder3);

    const result = decoder(input);

    expect(result.ok).toBe(true);
    assertCond(result.ok);

    expect(result.value).toBe(value3);

    expect(decoder1).toHaveBeenCalledTimes(1);
    expect(decoder1.mock.calls[0][0]).toBe(input);

    expect(decoder2).toHaveBeenCalledTimes(1);
    expect(decoder2.mock.calls[0][0]).toBe(value1);

    expect(decoder3).toHaveBeenCalledTimes(1);
    expect(decoder3.mock.calls[0][0]).toBe(value2);
  });

  it('fails on first error', () => {
    const input = {};
    const value1 = {};
    const value3 = {};

    const decoder1 = jest.fn(((x) => ({
      ok: true,
      value: value1,
    })) as Decoder<unknown>);

    const decoder2 = jest.fn(((x) => ({
      ok: false,
      error: [{ id: 'FAIL', text: 'failed', field: 'somefield' }],
    })) as Decoder<unknown>);

    const decoder3 = jest.fn(((x) => ({
      ok: true,
      value: value3,
    })) as Decoder<unknown>);

    const decoder = chain(decoder1, decoder2, decoder3);

    const result = decoder(input);

    expect(result.ok).toBe(false);
    assertCond(!result.ok);

    expect(result.error).toEqual([
      { id: 'FAIL', text: 'failed', field: 'somefield' },
    ]);

    expect(decoder1).toHaveBeenCalledTimes(1);
    expect(decoder1.mock.calls[0][0]).toBe(input);

    expect(decoder2).toHaveBeenCalledTimes(1);
    expect(decoder2.mock.calls[0][0]).toBe(value1);

    expect(decoder3).toHaveBeenCalledTimes(0);
  });
});
