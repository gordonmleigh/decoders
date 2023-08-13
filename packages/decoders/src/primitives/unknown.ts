import { decoder } from '../core/Decoder.js';
import { Result, ok } from '../core/Result.js';

/**
 * A decoder which can accept any value.
 */
export const unknown = decoder(
  (value: unknown): Result<unknown, never> => ok(value),
);
