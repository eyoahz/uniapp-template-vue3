import { defineStore } from 'pinia';
import { createUniStorage } from '@/common/utils/cache'
import { getUserInfoApi, logoutApi } from '@/common/api/user'

interface State {
	auth: string | null;
	userInfo: Record<string, any> | null;
	cacheKeys: string[];
}

const uniStorage = createUniStorage();

export const useUserStore = defineStore('user', {
	state: (): State => {
		let auth = uniStorage.get('auth') ?? null;
		return { 
			auth,	// 登录标识
			userInfo: {},	// 用户信息
		};
	},
	// 也可以这样定义
	// state: () => ({ count: 0 })
	actions: {
		/**
		 * @pinia 注册
		 */
		userRegist() {
			
		},
		/**
		 * @pinia 登录(获取令牌并在本地缓存)
		 * @param fn:登录函数，返回包含token的对象
		 */
		async userLogin(fn: () => Promise<any>) {
			try{
				const { data } = await fn();
				if(data?.token) {
					this.setAuth(data.token);
					this.getUserInfo();
				} else {
					this.setAuth(null);
				}
				return true
			}catch(e){
				throw e;
			}
		},
		/**
		 * @pinia 设置登录标识的值(设置本地缓存中令牌的值)
		 * @param {string} data:登录标识的值
		 * @returns {boolean} 返回是否成功设置登录标识
		 */
		setAuth(data: State['auth']) {
			this.auth = data;
		},
		/**
		 * @pinia 获取用户信息(并存储在本地缓存)
		 */
		async getUserInfo() {
			try {
				const { data } = await getUserInfoApi();
				this.userInfo = data;
			}catch(e) {
				console.log(e)
			}
		},
		/**
		 * @pinia 退出登录(并清除令牌缓存)
		 */
		async logout() {
			try {
				const { code } = await logoutApi();
				if(code === 200) {
					this.setAuth(null);
					this.userInfo = null;
					return true
				}
			}catch(e) {
				console.log(e)
				throw(e)
			}
		},
	},
});