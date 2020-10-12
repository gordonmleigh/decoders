import { predicate } from './predicate';

export const ExpectedInteger = 'EXPECTED_INTEGER';

export const isInt = predicate<number>(
  Number.isSafeInteger,
  'expected integer',
  ExpectedInteger,
);
