import { Decoder } from '../core/Decoder';
import { ok } from '../core/Result';

/**
 * A decoder which can accept any value.
 */
export const unknown: Decoder<unknown> = (value) => ok(value);
