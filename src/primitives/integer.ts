import { chain } from '../composite/chain';
import { isInt } from '../predicates/isInt';
import { number } from './number';

export const integer = chain(number, isInt);
