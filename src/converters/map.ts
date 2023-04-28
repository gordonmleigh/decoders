import { Decoder, decoder } from '../core/Decoder.js';
import { ok } from '../core/Result.js';

/**
 * Create a decoder which maps its input to another value.
 *
 * @param map A function to map the input value to an output value.
 *
 * @example
 *
 * ```typescript
 * const trim = map((value: string) => value.trim());
 * ```
 */
export function map<Out, In, Opts = void>(
  map: (value: In, opts?: Opts) => Out,
): Decoder<Out, In, never, Opts> {
  return decoder((value, opts) => ok(map(value, opts)));
}
