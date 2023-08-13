import { regexp } from './regexp.js';

// This is a slightly simplified version of the regex that appears in the W3C
// HTML5 spec, that doesn't place constraints on the initial character of
// domains since the payoff isn't worth the complexity.
const W3CEmailValidationRegex =
  /^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

/**
 * A decoder which accepts a valid email.
 *
 * The following regex is used to match the value:
 *
 * ```
 * /^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
 * ```
 *
 * This is a slightly simplified version of the regex that appears in the W3C
 * HTML5 spec, that doesn't place constraints on the initial character of
 * domains since the payoff isn't worth the complexity.
 */
export const email = regexp(W3CEmailValidationRegex).withError(
  'value:email',
  'expected email',
);
