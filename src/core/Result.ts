export interface DecoderError {
  id: string;
  text: string;
  field?: string;
}

export interface OkResult<T> {
  ok: true;
  value: T;
}

export interface ErrorResult {
  ok: false;
  error: DecoderError[];
}

export type Result<T> = OkResult<T> | ErrorResult;

export function ok<T>(value: T): OkResult<T> {
  return { ok: true, value };
}

export function error(error: DecoderError[]): ErrorResult {
  return { ok: false, error };
}

export function invalid(id: string, text: string, field?: string): ErrorResult {
  return { ok: false, error: [{ id, text, field }] };
}
