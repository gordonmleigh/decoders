import { trim } from '../converters/trim.js';
import { Decoder } from '../core/Decoder.js';
import { DecoderError } from '../core/DecoderError.js';
import { length } from '../predicates/length.js';
import { string } from '../primitives/string.js';
import { chain } from './chain.js';

/**
 * A decoder which accepts a string with at least one character. The string will
 * be trimmed.
 */
export const text: Decoder<string, unknown, DecoderError<'value:text'>> = chain(
  string,
  trim,
  length<string>({ min: 1 }),
).withError('value:text', 'expected non-empty text');
