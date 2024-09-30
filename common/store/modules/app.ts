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
					customIcon: '',
					iconSize: 20,
					badge: null,
					dot: false,
					badgeStyle: 'top: 6px;right:2px;',
					url: '',
				},
				{
					name: 'photo',
					text: '放映厅',
					icon: 'photo',
					customIcon: '',
					iconSize: 20,
					badge: null,
					dot: false,
					badgeStyle: 'top: 6px;right:2px;',
					url: '',
				},
				{
					name: 'play-right',
					text: '直播',
					icon: 'play-right',
					customIcon: '',
					iconSize: 20,
					badge: null,
					dot: false,
					badgeStyle: 'top: 6px;right:2px;',
					url: '',
				},
				{
					name: 'account',
					text: '我的',
					icon: 'account',
					customIcon: '',
					iconSize: 20,
					badge: null,
					dot: false,
					badgeStyle: 'top: 6px;right:2px;',
					url: '',
				},
			],
		};
	},
	// 也可以这样定义
	// state: () => ({ count: 0 })
	actions: {
		/**
		 * @pinia 设置登录标识的值(设置本地缓存中令牌的值)
		 * @param {string} name:切换标识
		 */
		setTabbarDefault(name: string) {
			if(this.tabbarDefault === name) return;
			this.tabbarDefault = name;
		}
	},
});