import { defineStore } from 'pinia';
import { createUniStorage } from '@/common/utils/cache';

const uniStorage = createUniStorage();

export const useAppStore = defineStore('app', {
	state: () => {
		let tabbarDefault = uniStorage.get('tabbarDefault') ?? 'home';
		return {
			tabbarDefault,
			tabbarList: [
				{
					name: 'home',
					text: '首页',
					icon: 'home',
					iconSize: 20,
					badge: null,
					dot: false,
					badgeStyle: 'top: 6px;right:2px;',
				},
				{
					name: 'photo',
					text: '放映厅',
					icon: 'photo',
					iconSize: 20,
					badge: null,
					dot: false,
					badgeStyle: 'top: 6px;right:2px;',
				},
				{
					name: 'play-right',
					text: '直播',
					icon: 'play-right',
					iconSize: 20,
					badge: null,
					dot: false,
					badgeStyle: 'top: 6px;right:2px;',
				},
				{
					name: 'account',
					text: '我的',
					icon: 'account',
					iconSize: 20,
					badge: null,
					dot: false,
					badgeStyle: 'top: 6px;right:2px;',
				},
			],
		};
	},
	// 也可以这样定义
	// state: () => ({ count: 0 })
	actions: {

	},
});