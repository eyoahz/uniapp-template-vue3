// @ts-ignore
import { http } from '@/common/utils/http'
// import { LoginParamsModel } from './model'

/**
 * @description 上传文件
 */
export function uploadApi(config: any) {
	// https://uniapp.dcloud.net.cn/api/request/network-file.html#uploadfile
	return http.upload('/system/oss/upload', config)
}

/**
 * @description 下载文件
 */
export function downloadApi(url: string, config: any = { custom: { isReturnNativeResponse: true } }) {
	// https://uniapp.dcloud.net.cn/api/request/network-file.html#downloadfile
	return http.download(url, config)
}