import { typePredicate } from '../predicates/typePredicate.js';

export const string = typePredicate(
  (value): value is string => typeof value === 'string',
  'value:string',
  'expected a string',
);
