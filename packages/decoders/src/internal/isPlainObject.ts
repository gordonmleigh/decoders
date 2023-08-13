import { isObject } from './isObject.js';

/**
 * @hidden
 */
export function isPlainObject(value: unknown): value is Record<any, unknown> {
  return (
    isObject(value) &&
    (Object.getPrototypeOf(value).isPrototypeOf(Object) ||
      Object.getPrototypeOf(value) === null)
  );
}
