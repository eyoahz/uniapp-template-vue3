// 错误状态码对应处理
import { useUserStore } from '@/common/store/modules/user';
// import Cache from '@/common/utils/cache';

let show = false;

export default function checkStatus(status, message) {
	console.error(`${uni.$u.page()}-${status}-${message}`)

	let errMessage = message ?? '';
	switch (status) {
		case 400: {
			errMessage = `${message}`;
			break;
		}
		case 401: {
			errMessage = message ?? '用户没有权限（令牌、用户名、密码错误）!';
			const user = useUserStore();
			user.setAuth(null);

			if (!show) {
				show = true
				uni.showModal({
					title: '未授权，请先进行登录！',
					cancelColor: 'rgba(136, 136, 136, 1)',
					confirmColor: '#2989ff',
					success: ({ confirm }) => {
						show = false
						confirm && uni.$u.route({
							type: 'navigateTo',
							url: '/pages/sub/public/login/index'
						})
					}
				});
			}
			break;
		}
		case 403: {
			errMessage = message ?? '用户得到授权，但是访问是被禁止的。!';
			const user = useUserStore();
			user.setAuth(null);

			if (!show) {
				show = true
				uni.showModal({
					title: '授权过期，请先进行登录！',
					cancelColor: 'rgba(136, 136, 136, 1)',
					confirmColor: '#2989ff',
					success: ({ confirm }) => {
						show = false
						confirm && uni.$u.route({
							type: 'navigateTo',
							url: '/pages/sub/public/login/index'
						})
					}
				});
			}
			break;
		}
		// 404请求不存在
		case 404: {
			errMessage = message ?? '网络请求错误,未找到该资源!';
			break;
		}
		case 405: {
			errMessage = message ?? '网络请求错误,请求方法未允许!';
			break;
		}
		case 408: {
			errMessage = message ?? '网络请求超时!';
			break;
		}
		case 500: {
			errMessage = message ?? '服务器错误,请联系管理员!';
			break;
		}
		case 501: {
			errMessage = message ?? '网络未实现!';
			break;
		}
		case 502: {
			errMessage = message ?? '网络错误!';
			break;
		}
		case 503: {
			errMessage = message ?? '服务不可用，服务器暂时过载或维护!';
			break;
		}
		case 504: {
			errMessage = message ?? '网络超时!';
			break;
		}
		case 505: {
			errMessage = message ?? 'http版本不支持该请求!';
			break;
		}
		default: {
			break;
		}
	}

	if (!show) {
		show = true
		errMessage && uni.showModal({
			title: '温馨提示',
			content: errMessage,
			success: () => {
				show = false
			}
		})
	}

	return errMessage
}
