import type { App } from 'vue';
import type { Pinia } from 'pinia';

import SecretPiniaPlugin from './plugin/secret'

export function setupStore(app: App<Element>, pinia: Pinia) {
	pinia.use(SecretPiniaPlugin)
	app.use(pinia)
}


