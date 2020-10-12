import { Decoder } from '../core/Decoder';
import { predicate } from './predicate';

/**
 * Error identifier returned when [[hasMinLength]] fails.
 */
export const ExpectedStringMinLength = 'STRING_MIN_LENGTH';

/**
 * Creates a predicate which requires a string to have the given minimum length.
 * @param min The minimum length allowed for the input value.
 */
export function hasMinLength(min: number): Decoder<string, string> {
  return predicate(
    (value) => value.length >= min,
    `must be at least ${min} characters`,
    ExpectedStringMinLength,
  );
}
