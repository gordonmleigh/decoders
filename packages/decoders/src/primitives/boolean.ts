import { typePredicate } from '../predicates/typePredicate.js';

/**
 * A decoder which can accept a boolean value.
 *
 * @group Primitives
 */
export const boolean = typePredicate(
  (value): value is boolean => typeof value === 'boolean',
).withError('value:boolean', 'expected boolean');
