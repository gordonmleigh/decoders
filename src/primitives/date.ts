import { isDate } from '../internal/isDate.js';
import { typePredicate } from '../predicates/typePredicate.js';

/**
 * A [[Decoder]] which can decode a Date value.
 */
export const date = typePredicate(isDate, 'value:date', 'expected date');
