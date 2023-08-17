import { isDate } from '../internal/isDate.js';
import { typePredicate } from '../predicates/typePredicate.js';

/**
 * A decoder which can accept a Date value.
 *
 * @group Primitives
 */
export const date = typePredicate(isDate).withError(
  'value:date',
  'expected date',
);
