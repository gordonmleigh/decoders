import { isObject } from './isObject.js';

/**
 * @hidden
 */
export function isDate(value: unknown): value is Date {
  if (
    isObject(value) &&
    (value instanceof Date ||
      Object.prototype.toString.call(value) === '[object Date]')
  ) {
    const t = (value as Date).getTime();
    return t === t;
  }
  return false;
}
