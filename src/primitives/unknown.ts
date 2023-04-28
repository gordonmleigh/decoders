import { validator } from '../core/DecoderValidator.js';
import { Result, ok } from '../core/Result.js';

/**
 * A decoder which can accept any value.
 */
export const unknown = validator(
  (value: unknown): Result<unknown, never> => ok(value),
);
