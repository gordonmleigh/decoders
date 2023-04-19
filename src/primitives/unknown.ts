import { decoder } from '../composite/decoder.js';
import { ok } from '../core/Result.js';

/**
 * A decoder which can accept any value.
 */
export const unknown = decoder((value: unknown) => ok(value));
