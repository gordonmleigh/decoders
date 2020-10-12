export function isDate(obj: unknown, checkValid = true): obj is Date {
  if (
    typeof obj === 'object' &&
    obj !== null &&
    Object.prototype.toString.call(obj) === '[object Date]'
  ) {
    if (!checkValid) {
      return true;
    }
    const t = (obj as Date).getTime();
    return t === t;
  }
  return false;
}
