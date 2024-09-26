import type { PiniaPluginContext } from 'pinia';
import { createUniStorage } from '@/common/utils/cache'

const uniStorage = createUniStorage();

interface PluginOptions {
	[key: string]: {
		cacheKeys: Array<string>;
	};
}
// 副作用：本地缓存
export default function CachePiniaPlugin(options: PluginOptions) {	
	return function(context: PiniaPluginContext) {
		const { store } = context;
		store.$subscribe((mutation) => {
			const { storeId, events } = mutation;
			if(Object.keys(options).includes(storeId)) {
				let cacheKeys = options[storeId].cacheKeys;
				cacheKeys.forEach(key => {
					events.target[key] === null ? uniStorage.remove(key) : uniStorage.set(key, events.target[key])
				})
			}
		})
	}
}