/**
 * Checks if `value` is `null` or `undefined`.
 */
export function isNil(value: any): boolean {
  return value == null || value == undefined;
}
