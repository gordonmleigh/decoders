import { DecoderError } from './DecoderError.js';

/**
 * Returned by a decoder on success.
 *
 * @group Core
 */
export interface OkResult<T> {
  ok: true;
  value: T;
}

/**
 * Returned by a decoder on failure.
 *
 * @group Core
 */
export interface ErrorResult<Err extends DecoderError = DecoderError> {
  ok: false;
  error: Err;
}

/**
 * Returned by a decoder.
 *
 * @group Core
 */
export type Result<T, Err extends DecoderError = DecoderError> =
  | OkResult<T>
  | ErrorResult<Err>;

/**
 * Create an {@link OkResult}.
 * @param value The value to return.
 *
 * @group Core
 */
export function ok<T>(value: T): OkResult<T> {
  return { ok: true, value };
}

/**
 * Create an {@link ErrorResult}.
 * @param error The error to return.
 *
 * @group Core
 */
export function error<Err extends DecoderError>(error: Err): ErrorResult<Err> {
  return { ok: false, error };
}

/**
 * Create an {@link ErrorResult}.
 * @param type A unique ID for the error, for programmatic use.
 * @param text A simple textual description of the error.
 * @param details Extra details, intended to be used in error formatting.
 *
 * @group Core
 */
export function invalid<Type extends string, Details>(
  type: Type,
  text: string,
  details?: Details,
): ErrorResult<DecoderError<Type> & Details> {
  return {
    ok: false,
    error: {
      text,
      type,
      ...details,
    } as DecoderError<Type> & Details,
  };
}
