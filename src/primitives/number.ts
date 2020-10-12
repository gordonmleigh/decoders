import { Decoder } from '../core/Decoder';
import { invalid, ok } from '../core/Result';

export const ExpectedNumber = 'EXPECTED_NUMBER';

export const number: Decoder<number> = (value) =>
  typeof value === 'number' && !Number.isNaN(value)
    ? ok(value)
    : invalid(ExpectedNumber, 'expected number');
