import 'jest';
import { assertCond } from '../internal/assertCond';
import { ConditionFailure, predicate } from './predicate';

describe('predicate', () => {
  it('accepts values if the predicate function returns true', () => {
    const mapper = jest.fn((x: unknown) => true);

    const decoder = predicate(mapper);
    const input = Symbol();

    const result = decoder(input);

    expect(result.ok).toBe(true);
    assertCond(result.ok);
    expect(result.value).toBe(input);

    expect(mapper).toHaveBeenCalledTimes(1);
    expect(mapper.mock.calls[0][0]).toBe(input);
  });

  it('rejects values if the predicate function returns false', () => {
    const mapper = jest.fn((x: unknown) => false);

    const decoder = predicate(mapper);
    const input = Symbol();

    const result = decoder(input);

    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error[0].id).toBe(ConditionFailure);

    expect(mapper).toHaveBeenCalledTimes(1);
    expect(mapper.mock.calls[0][0]).toBe(input);
  });

  it('uses custom text and id if supplied', () => {
    const mapper = jest.fn((x: unknown) => false);

    const decoder = predicate(mapper, 'text', 'FAIL');
    const input = Symbol();

    const result = decoder(input);

    expect(result.ok).toBe(false);
    assertCond(!result.ok);
    expect(result.error[0].id).toBe('FAIL');
    expect(result.error[0].text).toBe('text');

    expect(mapper).toHaveBeenCalledTimes(1);
    expect(mapper.mock.calls[0][0]).toBe(input);
  });
});
