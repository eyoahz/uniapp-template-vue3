import Request from './core/Request'
import { 
	requestInterceptorFulfilled,
	requestInterceptorRejected,
	responseInterceptorFulfilled,
	responseInterceptorRejected
} from './interceptors'

export const http = new Request();

http.setConfig((config) => {
	config.baseURL = import.meta.env.VITE_GLOB_API_URL,
	config.custom = {
		auth: true, // 是否传token
		// loading: false // 是否使用loading
		isReturnNativeResponse: false,	// 是否返回原始响应数据 比如：需要获取响应头时使用该属性
		// setResponseDateField: '',		// 自定义 响应头数据获取字段 - 可以是 字符串 或 数组 例如：'header' ['data', 'result']
	}
	// config.paramsSerializer = function() {}	// 自定义处理params参数的方法
	return config
})

// 请求拦截
http.interceptors.request.use(requestInterceptorFulfilled, requestInterceptorRejected)

// 响应拦截
http.interceptors.response.use(responseInterceptorFulfilled, responseInterceptorRejected)