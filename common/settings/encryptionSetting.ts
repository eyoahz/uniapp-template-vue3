import { isDevMode } from '@/common/utils/env'

// 系统默认缓存时间，单位秒
export const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7;

// aes加密密钥
export const cacheCipher = {
  key: '_11111000001111@',
  iv: '@11111000001111_',
};

// 缓存是否使用aes加密
export const SHOULD_ENABLE_STORAGE_ENCRYPTION = !isDevMode();
