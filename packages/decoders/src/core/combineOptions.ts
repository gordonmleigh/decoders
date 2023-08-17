import { stripUndefined } from '../internal/stripUndefined.js';

/**
 * Merges option objects, ignoring values which are `undefined`.
 *
 * @group Core
 */
export function combineOptions<Opts>(...options: (Opts | undefined)[]): Opts {
  return Object.assign({}, ...options.map(stripUndefined));
}
