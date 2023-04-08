import { Decoder } from '../core/Decoder.js';
import { ok } from '../core/Result.js';

/**
 * A decoder which can accept any value.
 */
export const unknown: Decoder<unknown> = {
  decode: (value) => ok(value),
};
