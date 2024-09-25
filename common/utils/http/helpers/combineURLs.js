
/**
 * 通过组合指定的 URL 创建新的 URL
 * 
 * @param {string} baseURL
 * @param {string} relativeURL
 * @returns {string}
 */
export default function combineURLs(baseURL, relativeURL) {
	return relativeURL
		? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')			// 将 baseURL 尾部的 '/' 去掉，将 relativeURL 头部的 '/' 去掉
		: baseURL
}