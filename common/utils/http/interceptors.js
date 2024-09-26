import { getValueByField } from './utils.js'
import { useUserStore } from '@/common/store/modules/user'
import checkStatus from './checkStatus.js'

// 请求拦截
export const requestInterceptorFulfilled = (config) => { // 可使用async await 做异步操作
	// 初始化请求拦截器时，会执行此方法，此时data为undefined，赋予默认{}
	config.data = config.data || {}
	// 根据custom参数中配置的是否需要token，添加对应的请求头
	if(config?.custom?.auth) {
		const user = useUserStore();
		// 请求头携带token
		config.header.Authorization = `Bearer ${user.auth}`
	}
	return config 
}

export const requestInterceptorRejected = (config) => { // 可使用async await 做异步操作
	return Promise.reject(config)
}



// 响应拦截
export const responseInterceptorFulfilled = (response) => { /* 对响应成功做点什么 可使用async await 做异步操作*/
	const data = response.data

	// 自定义参数
	const custom = response.config?.custom
	
	
	// if (data?.code !== 200) {
	// 	// 如果没有显式定义custom的toast参数为false的话，默认对报错进行toast弹出提示
	// 	if (custom?.toast !== false) {
	// 		uni.showToast({
	// 			icon: 'none',
	// 			title: data?.msg ?? '请求失败'
	// 		})
	// 	}

	// 	// 如果需要catch返回，则进行reject
	// 	if (custom?.catch) {
	// 		return Promise.reject(data)
	// 	} else {
	// 		// 否则返回一个pending中的promise，请求不会进入catch中
	// 		return new Promise(() => { })
	// 	}
	// }
	
	// 返回原始响应数据
	if(custom?.isReturnNativeResponse) {
		return response
	}
	
	
	// 根据 自定义的原始响应数据获取字段 来获取数据
	if(custom?.setResponseDateField) {
		const customField = custom?.setResponseDateField
		const result = getValueByField(response, customField)
		return result === undefined ? {} : result
	}
	return data === undefined ? {} : data
}

export const responseInterceptorRejected = (response) => { 
	// 对响应错误做点什么 （statusCode !== 200）
	console.log('对响应错误做点什么', response);
	checkStatus(response.statusCode)
	return Promise.reject(response)
}