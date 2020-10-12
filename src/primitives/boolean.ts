import { Decoder } from '../core/Decoder';
import { invalid, ok, Result } from '../core/Result';

export const ExpectedBoolean = 'EXPECTED_BOOLEAN';

export const boolean: Decoder<boolean> = (value: unknown): Result<boolean> =>
  typeof value === 'boolean'
    ? ok(value)
    : invalid(ExpectedBoolean, 'expected boolean');
