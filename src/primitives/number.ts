import { typePredicate } from '../predicates/typePredicate.js';

/**
 * The error identifier returned when [[number]] fails.
 */
export const ExpectedNumber = 'EXPECTED_NUMBER';

/**
 * A [[decoder]] which can decode a number value.
 */
export const number = typePredicate(
  (value): value is number =>
    typeof value === 'number' && Number.isFinite(value),
  'expected number',
  ExpectedNumber,
);
