
import * as utils from '../utils.js'

/**
 * 
 * encodeURIComponent方法： 对 URL 进行编码，转化特殊字符（;/?&=+$,#等），使 URL 能作为参数传递
 * 
 * replace的作用：有些特殊字符在特定的上下文中具有特殊的含义，需要还原为原始字符才能正确解析和使用
 * 
 * @param {string} val
 * @returns {string}
 */
function encode(val) {
	return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',')
		.replace(/%20/g, '+').replace(/%5B/gi, '[').replace(/%5D/gi, ']')
}


// 
/**
 * 将参数附加到 URL 的末尾
 * 
 * @param {Object} url
 * @param {Object} params
 * @param {Object} paramsSerializer
 * @returns {string} 格式化后的 URL
 */
export default function buildURL(url, params, paramsSerializer) {
	/*eslint no-param-reassign:0*/
	if (!params) {
		return url
	}

	let serializedParams // var变为let
	if (paramsSerializer) { // 如果有传入 参数序列化 方法
		serializedParams = paramsSerializer(params)
	} else if (utils.isURLSearchParams(params)) { // 如果为查询字符串的实例( 例如：const params = new URLSearchParams('?name=John&age=25'))
		serializedParams = params.toString()		// params为查询字符串实例，toString() 方法可以可以获取查询参数 'name=John&age=25''
	} else {
		let parts = [] // var变为let

		utils.forEach(params, function serialize(val, key) {
			if (val === null || typeof val === 'undefined') {
				return
			}

			if (utils.isArray(val)) {
				key = key + '[]'
			} else {
				val = [val]
			}

			utils.forEach(val, function parseValue(v) {
				if (utils.isDate(v)) {
					v = v.toISOString()
				} else if (utils.isObject(v)) {
					v = JSON.stringify(v)		// 只解了一层，之后的全用JSON字符串代替
				}
				parts.push(encode(key) + '=' + encode(v))
			})
		})

		serializedParams = parts.join('&')
	}

	if (serializedParams) {
		var hashmarkIndex = url.indexOf('#')
		if (hashmarkIndex !== -1) {
			url = url.slice(0, hashmarkIndex)		// 注意：请求时会把 url 中 #（hash）之后的去除
		}

		url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
	}

	return url
}