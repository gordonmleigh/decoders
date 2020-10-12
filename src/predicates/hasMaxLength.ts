import { Decoder } from '../core/Decoder';
import { predicate } from './predicate';

export const ExpectedStringMaxLength = 'STRING_MAX_LENGTH';

export function hasMaxLength(n: number): Decoder<string, string> {
  return predicate(
    (value) => value.length >= n,
    `must be ${n} characters or less`,
    ExpectedStringMaxLength,
  );
}
