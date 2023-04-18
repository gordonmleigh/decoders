import { typePredicate } from '../predicates/typePredicate.js';

/**
 * A [[decoder]] which can decode a number value.
 */
export const number = typePredicate(
  (value): value is number =>
    typeof value === 'number' && Number.isFinite(value),
  'expected number',
  'value:number',
);
