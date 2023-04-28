import { stripUndefined } from '../internal/stripUndefined.js';

export function combineOptions<Opts>(...options: (Opts | undefined)[]): Opts {
  return Object.assign({}, ...options.map(stripUndefined));
}
