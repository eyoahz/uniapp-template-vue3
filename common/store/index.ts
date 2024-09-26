import type { App } from 'vue';
import type { Pinia } from 'pinia';

import CachePiniaPlugin from './plugin/cache'

export function setupStore(app: App<Element>, pinia: Pinia) {
	pinia.use(CachePiniaPlugin({ 
		user: { cacheKeys: ['auth', 'userInfo'] } 
	}))
	app.use(pinia)
}


