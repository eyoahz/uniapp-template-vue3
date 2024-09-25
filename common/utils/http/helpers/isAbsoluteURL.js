
/**
 * 判断一个字符串是否符合 URL 的协议部分的格式
 * 
 * @param {string} url
 * @returns {boolean}
 */
export default function isAbsoluteURL(url) {
	return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}