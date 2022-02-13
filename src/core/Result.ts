import { DecoderError } from './DecoderError.js';

/**
 * Returned by a [[Decoder]] on success.
 */
export interface OkResult<T> {
  ok: true;
  value: T;
}

/**
 * Returned by a [[Decoder]] on failure.
 */
export interface ErrorResult {
  ok: false;
  error: DecoderError[];
}

/**
 * Returned by a [[Decoder]].
 */
export type Result<T> = OkResult<T> | ErrorResult;

/**
 * Create an [[OkResult]].
 * @param value The value to return.
 */
export function ok<T>(value: T): OkResult<T> {
  return { ok: true, value };
}

/**
 * Create an [[ErrorResult]].
 * @param error The error to return.
 */
export function error(error: DecoderError[]): ErrorResult {
  return { ok: false, error };
}

/**
 * Create an [[ErrorResult]] with a single error.
 * @param id A unique ID for the error, for programmatic use.
 * @param text A simple textual description of the error.
 * @param field The field causing the error. Possibly dot-separated path.
 * @param details Extra details, intended to be used in error formatting.
 */
export function invalid(
  id: string,
  text: string,
  field?: string,
  details?: Record<string, any>,
): ErrorResult {
  return { ok: false, error: [{ id, text, field, details }] };
}
