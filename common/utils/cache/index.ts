import { getStorageShortName } from '@/common/utils/env';
import { CreateStorageParams, createStorage as create } from './storageCache'
import { SHOULD_ENABLE_STORAGE_ENCRYPTION, DEFAULT_CACHE_TIME } from '@/common/settings/encryptionSetting';

export type Options = Partial<CreateStorageParams>;

const createOptions = (storage: Storage, options: Options = {}): Options => {
	return {
		// 默认开发模式下不加密
		hasEncrypt: SHOULD_ENABLE_STORAGE_ENCRYPTION,
		storage,
		prefixKey: getStorageShortName(),
		...options,
	}
}

export const WebStorage = create(createOptions(sessionStorage) as CreateStorageParams);

export const createStorage = (storage: Storage = sessionStorage, options: Options = {}) => {
	return create(createOptions(storage, options) as CreateStorageParams)
}

export const createSessionStorage = (options: Options = {}) => {
	return createStorage(sessionStorage, { ...options, timeout: DEFAULT_CACHE_TIME })
}

export const createLocalStorage = (options: Options = {}) => {
	return createStorage(localStorage, { ...options, timeout: DEFAULT_CACHE_TIME })
}

export default WebStorage;