/* eslint-disable import/no-extraneous-dependencies */
import 'jest';
import { ErrorResult, OkResult, Result } from '../../core/Result.js';
import { assertCond } from '../assertCond.js';

export function expectValid<T>(
  result: Result<T>,
  value?: T,
): asserts result is OkResult<T> {
  expect(result.ok).toBe(true);
  assertCond(result.ok);

  if (arguments.length > 1) {
    expect(result.value).toEqual(value);
  }
}

export function expectInvalid(
  result: Result<any>,
  error?: string,
): asserts result is ErrorResult {
  expect(result.ok).toBe(false);
  assertCond(!result.ok);

  if (error !== undefined) {
    expect(result.error.type).toEqual(error);
  }
}
