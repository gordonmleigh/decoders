import { typePredicate } from '../predicates/typePredicate.js';

/**
 * A {@link Decoder} which can decode a boolean value.
 */
export const boolean = typePredicate(
  (value): value is boolean => typeof value === 'boolean',
  'expected boolean',
  'value:boolean',
);
