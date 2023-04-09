import { typePredicate } from '../predicates/typePredicate.js';

/**
 * Error identifer returned when {@link boolean} fails.
 */
export const ExpectedBoolean = 'EXPECTED_BOOLEAN';

/**
 * A {@link Decoder} which can decode a boolean value.
 */
export const boolean = typePredicate(
  (value): value is boolean => typeof value === 'boolean',
  'expected boolean',
  ExpectedBoolean,
);
