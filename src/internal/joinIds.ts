/**
 * @hidden
 */
export function joinIds(...ids: (string | undefined)[]): string {
  return ids.filter(Boolean).join('.');
}
