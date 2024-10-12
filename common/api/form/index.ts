// @ts-ignore
import { http } from '@/common/utils/http'

// 获取有效客户等级列表
export function getCustomGradeList() {
	return http.get('/dealer/custom/getCustomGradeList', null, { custom: { setResponseDateField: ['data', 'data'] }})
}

// 获取有效大区树
export function getRegionList() {
	return http.get('/dealer/custom/getRegionList', null, { custom: { setResponseDateField: ['data', 'data'] }})
}