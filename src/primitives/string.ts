import { Decoder } from '../core/Decoder';
import { invalid, ok } from '../core/Result';

export const ExpectedString = 'EXPECTED_STRING';

export const string: Decoder<string> = (value) =>
  typeof value === 'string'
    ? ok(value)
    : invalid(ExpectedString, 'expected text');
