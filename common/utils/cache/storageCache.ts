import { cacheCipher } from '@/common/settings/encryptionSetting';
import { isNil } from '@/common/utils/is';
import { Encryption, EncryptionFactory, EncryptionParams } from '@/common/utils/cipher';

// uniapp 数据缓存方法接口
export interface UniStorageKeys {
	setItem: (key: string, data: string) => void;
	getItem: (key: string) => string;
	removeItem: (key: string) => void;
	clear: () => void;
}

export interface CreateStorageParams extends EncryptionParams {
	prefixKey: string;
	storage: Storage | UniStorageKeys;
	hasEncrypt: boolean;
	timeout?: number | null;
}

export const createStorage = ({
	prefixKey = '',
	storage = sessionStorage,
	hasEncrypt = true,
	timeout = null,	// 默认过期时间24小时
	key = cacheCipher.key,
	iv = cacheCipher.iv,
}: CreateStorageParams) => {
	if(hasEncrypt && [key.length, iv.length].some(item => item !== 16)) {
		throw new Error('When hasEncrypt is true, the key or iv must be 16 bits!');
	}
	
	const persistEncryption: Encryption = EncryptionFactory.createAesEncryption({
		// 当参数是一个对象，对象解构赋值时，参数为undefined，则不会使用默认值
		// 当参数为 { prefixKey: '12312' } 时， 解构出来的 key 和 iv 为 undefined
		key: cacheCipher.key,
		iv: cacheCipher.iv,
	})
	
	const WebStorage = class WebStorage {
		private storage: Storage | UniStorageKeys;
		private prefixKey?: string;
		private encryption: Encryption;
		private hasEncrypt: boolean;
		
		constructor() {
			this.storage = storage;
			this.prefixKey = prefixKey;
			this.encryption = persistEncryption;
			this.hasEncrypt = hasEncrypt;
		}
		
		private getKey(key: string): string {
			return `${this.prefixKey}${key}`.toUpperCase();
		}
		
		/**
		 * 设置缓存
		 * @param {string} key
		 * @param {*} value
		 * @param {*} expire	Expiration time in seconds
		 * @memberof Cache
		 */
		set(key: string, value: any, expire: number | null = timeout): void {
			const stringData = JSON.stringify({
				value,
				time: Date.now(),
				expire: !isNil(expire) ? Date.now() + expire! * 1000 : null,
			})
			const stringifyValue = this.hasEncrypt ? this.encryption.encrypt(stringData) : stringData;
			this.storage.setItem(this.getKey(key), stringifyValue)
		}
		
		/**
		 * 读取缓存
		 * @param {string} key
		 * @param {*} def
		 * @memberof Cache
		 */
		get(key: string, def: any = null): any {
			const val = this.storage.getItem(this.getKey(key));
			if (!val) return def;
			
			try{
				const decVal = this.hasEncrypt ? this.encryption.decrypt(val) : val;
				const data = JSON.parse(decVal);
				const { value, expire } = data;
				
				if(isNil(expire) || expire > Date.now()) {
					return value;
				}
				// 过期移除缓存
				this.remove(key);
			}catch(e){
				return def;
			}
		}
		
		/**
		 * 移除缓存
		 * @param {string} key
		 * @memberof Cache
		 */
		remove(key: string | Array<string>): void {
			if(Array.isArray((key))) {
				key.forEach(item => {
					this.storage.removeItem(this.getKey(item))
				})
			} else {
				this.storage.removeItem(this.getKey(key))
			}
		}
		
		/**
		 * 移除所有缓存
		 */
		clear() {
			this.storage.clear();
		}
	}
	
	return new WebStorage();
}