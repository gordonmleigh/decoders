/**
 * @hidden
 */
export function filterFalsey<T>(...items: (T | false | 0 | '' | null)[]): T[] {
  return items.filter(Boolean) as T[];
}
