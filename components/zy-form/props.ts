export interface PropsModel {
	labelPosition: string;
	labelWidth: string | number;
	borderBottom: boolean;
	showActionButtonGroup: boolean;
	showResetButton: boolean;
	resetText: string;
	showSubmitButton: boolean;
	submitText: string;
	footerFixed: boolean;
	readonly: boolean;
	schemas: Array<any>;
}

export const propsDefault = {
	labelPosition: 'top',	// 全局表单域提示文字的位置，left-左侧，top-上方
	labelWidth: 45,
	borderBottom: false,
	showActionButtonGroup: true,	// 是否显示操作按钮(重置/提交)
	showResetButton: true,	// 是否显示重置按钮
	resetText: '重置',	// 重置按钮显示文本
	showSubmitButton: true,	// 是否显示提交按钮
	submitText: '提交',	// 提交按钮显示文本
	footerFixed: true,	// 操作按钮是否固定位置
	readonly: false,	// 表单是否只读
	schemas: () => ([]),
}