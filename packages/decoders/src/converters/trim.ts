import { map } from './map.js';

/**
 * A decoder which trims the whitespace from start and end of its input.
 *
 * @example
 *
 * ```typescript
 * const value = trim(' hello world\n') // = { ok: true, value: 'hello world' }
 * ```
 */
export const trim = map((x: string) => x.trim());
