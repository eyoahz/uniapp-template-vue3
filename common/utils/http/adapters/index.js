import buildURL from '../helpers/buildURL'
import buildFullPath from '../core/buildFullPath'
import settle from '../core/settle'
import { isUndefined } from "../utils.js"

/**
 * 返回可选值存在的配置
 * @param {Array} keys - 可选值数组
 * @param {Object} config2 - 配置
 * @return {{}} - 存在的配置项
 */
const mergeKeys = (keys, config2) => {
  let config = {}
  keys.forEach(prop => {
    if (!isUndefined(config2[prop])) {
      config[prop] = config2[prop]
    }
  })
  return config
}
export default (config) => {
  return new Promise((resolve, reject) => {
    let fullPath = buildURL(buildFullPath(config.baseURL, config.url), config.params, config.paramsSerializer)	// 生成带查询参数的完整的 URL 地址
    const _config = {
      url: fullPath,
      header: config.header,
      complete: (response) => {	// 接口调用结束的回调函数（调用成功、失败都会执行）
        config.fullPath = fullPath
        response.config = config		// 将配置的 config 放入响应的数据中，以便相应拦截器使用
        response.rawData = response.data		// 复制一份response.data的数据，看需求是否注释
        try {
          let jsonParseHandle = false
          const forcedJSONParsingType = typeof config.forcedJSONParsing
          if (forcedJSONParsingType === 'boolean') {
            jsonParseHandle = config.forcedJSONParsing
          } else if (forcedJSONParsingType === 'object') {
            const includesMethod = config.forcedJSONParsing.include || []	// 可以指定哪些请求方法需要将响应数据json化
            jsonParseHandle = includesMethod.includes(config.method)
          }

          // 对可能 要解析的字符串 不是 json字符串 的情况的容错（加个是否为 string 类型的判断）
          if (jsonParseHandle && typeof response.data === 'string') {
            response.data = JSON.parse(response.data)
          }
          // eslint-disable-next-line no-empty
        } catch (e) {
        }
        settle(resolve, reject, response)		// 根据响应状态码，决定 Promise 状态
      }
    }
    let requestTask
    if (config.method === 'UPLOAD') {	// 如果是上传请求
      delete _config.header['content-type']
      delete _config.header['Content-Type']
      let otherConfig = {
        // #ifdef MP-ALIPAY
        fileType: config.fileType,
        // #endif
        filePath: config.filePath,
        name: config.name
      }
      const optionalKeys = [
        // #ifdef APP-PLUS || H5
        'files',
        // #endif
        // #ifdef H5
        'file',
        // #endif
        // #ifdef H5 || APP-PLUS || MP-WEIXIN || MP-ALIPAY || MP-TOUTIAO || MP-KUAISHOU
        'timeout',
        // #endif
        'formData'
      ]
			// 详见：https://uniapp.dcloud.net.cn/api/request/network-file.html
      requestTask = uni.uploadFile({..._config, ...otherConfig, ...mergeKeys(optionalKeys, config)})
    } else if (config.method === 'DOWNLOAD') {	// 如果是下载请求
      const optionalKeys = [
        // #ifdef H5 || APP-PLUS || MP-WEIXIN || MP-ALIPAY || MP-TOUTIAO || MP-KUAISHOU
        'timeout',
        // #endif
        // #ifdef MP
        'filePath',
        // #endif
      ]
			// 详见：https://uniapp.dcloud.net.cn/api/request/network-file.html
      requestTask = uni.downloadFile({..._config, ...mergeKeys(optionalKeys, config)})
    } else {
      const optionalKeys = [
        'data',
        'method',
        // #ifdef H5 || APP-PLUS || MP-ALIPAY || MP-WEIXIN
        'timeout',
        // #endif
        'dataType',
        // #ifndef MP-ALIPAY
        'responseType',
        // #endif
        // #ifdef APP-PLUS
        'sslVerify',
        // #endif
        // #ifdef H5
        'withCredentials',
        // #endif
        // #ifdef APP-PLUS
        'firstIpv4',
        // #endif
        // #ifdef MP-WEIXIN
        'enableHttp2',
        'enableQuic',
        // #endif
        // #ifdef MP-TOUTIAO || MP-WEIXIN
        'enableCache',
        // #endif
        // #ifdef MP-WEIXIN
        'enableHttpDNS',
        'httpDNSServiceId',
        'enableChunked',
        'forceCellularNetwork',
        // #endif
        // #ifdef MP-ALIPAY
        'enableCookie',
        // #endif
        // #ifdef MP-BAIDU
        'cloudCache',
        'defer'
        // #endif
      ]
      // 详见：https://uniapp.dcloud.net.cn/api/request/request.html
			requestTask = uni.request({..._config, ...mergeKeys(optionalKeys, config)})
    }
    if (config.getTask) {
      config.getTask(requestTask, config)
    }
  })
}
