import { typePredicate } from '../predicates/typePredicate.js';

/**
 * A decoder which can accept a string value.
 */
export const string = typePredicate(
  (value): value is string => typeof value === 'string',
).withError('value:string', 'expected a string');
