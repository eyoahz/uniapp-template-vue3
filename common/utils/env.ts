import pkg from '@/package.json';

export function getCommonStoragePrefix(): string {
	const VITE_GLOB_APP_TITLE = import.meta.env.VITE_GLOB_APP_TITLE
  return `${VITE_GLOB_APP_TITLE.replace(/\s/g, '_')}__${getEnv()}`.toUpperCase();
}

// 根据版本生成缓存key
export function getStorageShortName(): string {
  return `${getCommonStoragePrefix()}${`__${pkg.version}`}__`.toUpperCase();
}

/**
 * @description: 是否是开发环境
 */
export function isDevMode(): Boolean {
  return (import.meta.env.MODE || process.env.NODE_ENV) === 'development';
}

/**
 * @description: 获取应用运行模式
 */
export function getEnv(): string {
  return (import.meta.env.MODE || process.env.NODE_ENV) as string;
}
