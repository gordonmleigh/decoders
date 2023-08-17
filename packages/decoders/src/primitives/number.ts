import { typePredicate } from '../predicates/typePredicate.js';

/**
 * A decoder which can accept a number value.
 *
 * @group Primitives
 */
export const number = typePredicate(
  (value): value is number =>
    typeof value === 'number' && Number.isFinite(value),
).withError('value:number', 'expected number');
