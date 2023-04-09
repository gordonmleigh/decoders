import { isDate } from '../internal/isDate.js';
import { typePredicate } from '../predicates/typePredicate.js';

/**
 * The error identifier returned when [[date]] fails.
 */
export const ExpectedDate = 'EXPECTED_DATE';

/**
 * A [[Decoder]] which can decode a Date value.
 */
export const date = typePredicate(isDate, 'expected date', ExpectedDate);
