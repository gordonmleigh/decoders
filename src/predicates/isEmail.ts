import { regexp } from './regexp.js';

// This is a slightly simplified version of the regex that appears in the W3C
// HTML5 spec, that doesn't place constraints on the initial character of
// domains since the payoff isn't worth the complexity.
export const W3CEmailValidationRegex =
  /^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export const isEmail = regexp(W3CEmailValidationRegex).withError(
  'value:email',
  'expected email',
);
