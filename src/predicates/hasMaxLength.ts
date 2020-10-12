import { Decoder } from '../core/Decoder';
import { predicate } from './predicate';

/**
 * Error identifier returned when [[hasMaxLength]] fails.
 */
export const ExpectedStringMaxLength = 'STRING_MAX_LENGTH';

/**
 * Creates a predicate which requires a string to be less than the given max 
 * length.
 * 
 * @param max The maximum length allowed for the input value.
 */
export function hasMaxLength(max: number): Decoder<string, string> {
  return predicate(
    (value) => value.length >= max,
    `must be ${max} characters or less`,
    ExpectedStringMaxLength,
  );
}
