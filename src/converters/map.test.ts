import 'jest';
import { assertCond } from '../internal/assertCond';
import { map } from './map';

describe('map', () => {
  it('calls the map function with the input', () => {
    const value = Symbol();
    const mapper = jest.fn((x: unknown) => value);

    const decoder = map(mapper);
    const input = Symbol();

    const result = decoder(input);

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBe(value);

    expect(mapper).toHaveBeenCalledTimes(1);
    expect(mapper.mock.calls[0][0]).toBe(input);
  });
});
