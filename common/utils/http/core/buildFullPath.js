
import isAbsoluteURL from '../helpers/isAbsoluteURL'
import combineURLs from '../helpers/combineURLs'

/**
 * 当 requestedURL 不是绝对路径时，通过将 baseURL 与 requestedURL 组合，创建一个新的URL。
 * 如果 requestURL 是绝对路径，该函数将返回未经修改的 requestedURL。
 *
 * @param {string} baseURL
 * @param {string} requestedURL
 * @returns {string} 组合后的完整路径
 */
export default function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL)
  }
  return requestedURL
}
