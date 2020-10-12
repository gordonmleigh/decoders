import { Decoder } from '../core/Decoder';
import { predicate } from './predicate';

export const ExpectedStringMinLength = 'STRING_MIN_LENGTH';

export function hasMinLength(n: number): Decoder<string, string> {
  return predicate(
    (value) => value.length >= n,
    `must be at least ${n} characters`,
    ExpectedStringMinLength,
  );
}
