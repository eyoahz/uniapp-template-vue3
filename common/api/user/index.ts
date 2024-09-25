// @ts-ignore
import { http } from '@/common/utils/http'
import { LoginParamsModel } from './model'

/**
 * @description 获取验证码图片
 */
export function getCaptchaApi() {
	return http.get('/captchaImage', null, { custom: { auth: false } })
}

/**
 * @description 用户登录
 */
export function loginApi(data: LoginParamsModel) {
	return http.post('/mp/login', data, { custom: { auth: false } })
}

/**
 * @description 获取用户信息
 */
export function getUserInfoApi() {
	return http.get('/getInfo')
}

/**
 * @description 退出登录
 */
export function logoutApi() {
	return http.post('/logout')
}