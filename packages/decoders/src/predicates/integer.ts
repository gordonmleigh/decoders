import { typePredicate } from './typePredicate.js';

/**
 * A predicate which requires a number to be an integer by
 * using Number.isSafeInteger().
 *
 * @group Predicates
 */
export const integer = typePredicate((value): value is number =>
  Number.isSafeInteger(value),
).withError('value:integer', 'expected integer');
