/**
 * Checks if `value` is `null` or `undefined`.
 */
export function isNil(value: any): boolean {
  return value == null || value == undefined;
}

/**
 * 是否为 Function（函数）
 */
export function isFunction(o: any) {
	return typeof o === 'function';
}
