export interface PropsModel {
	cancelColor: string;
	confirmColor: string;
	title: string;
	color: string;
	selected: Array<any>;
	lunar: boolean;
	startDate: string;
	endDate: string;
	mode: string;
	insert: boolean;
	showMonth: boolean;
	clearDate: boolean;
	round: string | number;
	closeOnClickOverlay: boolean;
	startText: string;
	endText: string;
	allowSameDay: boolean;
	readonly: boolean;
	
	modelValue: any;
	schema: Record<string, any>;
}

export const propsDefault = {
	cancelColor: '',	//	取消按钮颜色
	confirmColor: '#3c9cff',	//	确认按钮颜色，range模式下未选全显示灰色
	title: '',	//	标题
	color: '#3c9cff',	//	主题色
	selected: () => ([]),	//	打点等设置
	lunar: false,	//	是否显示农历
	startDate: '',	//	可选择的起始日期
	endDate: '',	//	可选择的结束日期
	mode: 'range',	//	multiple - 选择多日期  range - 选择日期范围
	insert: false,	//	是否插入模式
	showMonth: true,	//	是否显示月份为背景
	clearDate: true,	//	弹窗模式是否清空上次选择内容
	round: 8,	//	弹窗圆角
	closeOnClickOverlay: true,	//	点击遮罩是否关闭弹窗
	startText: '开始',		//	range为true时，第一个日期底部的提示文字
	endText: '结束',		//	range为true时，最后一个日期底部的提示文字
	allowSameDay: false,	//	是否允许日期范围的起止时间为同一天，mode = range时有效
	readonly: false,	// 是否只读
	
	modelValue: '',	// 值 v-model
	schema: () => ({ componentProps: {} }),	// 纲要
}