export interface PropsModel {
	showToolbar: boolean;
	title: string;
	round: string | number;
	loading: boolean;
	itemHeight: string | number;
	cancelText: string;
	confirmText: string;
	cancelColor: string;
	confirmColor: string;
	color: string;
	activeColor: string;
	visibleItemCount: string | number;
	closeOnClickOverlay: boolean;
	closeOnClickConfirm: boolean;
	immediateChange: boolean;
	modelValue: any;
	schema: Record<string, any>;
	readonly: boolean;
	
}

export const propsDefault = {
	showToolbar: true,	// 是否展示顶部的操作栏
	title: '',	// 顶部标题
	round: 0,	// 弹窗圆角
	loading: false,	// 是否显示加载中状态
	itemHeight: 44,	// 各列中，单个选项的高度
	cancelText: '取消',	// 取消按钮的文字
	confirmText: '确定',	// 确认按钮的文字
	cancelColor: '#909193',	// 取消按钮的颜色
	confirmColor: '#3c9cff',	// 确认按钮的颜色
	color: '',	// 文字颜色
	activeColor: '',	// 选中文字的颜色
	visibleItemCount: 5,	// 每列中可见选项的数量
	closeOnClickOverlay: true,	// 是否允许点击遮罩关闭选择器
	closeOnClickConfirm: true,	// 是否允许点击确认关闭选择器
	immediateChange: true,	// 是否在手指松开时立即触发 change 事件。若不开启则会在滚动动画结束后触发 change 事件，只在微信2.21.1及以上有效
	modelValue: '',	// 值 v-model
	schema: () => ({ componentProps: {} }),	// 纲要
	readonly: false,	// 是否只读
}