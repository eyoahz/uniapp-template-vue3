<script setup lang="ts">
	/**
	 * Calendar 日历
	 * @description 日历组件可以查看日期，选择任意范围内的日期，打点操作。常用场景如：酒店日期预订、火车机票选择购买日期、上下班打卡等
	 * @tutorial https://ext.dcloud.net.cn/plugin?name=uv-calendar
	 * @property {String} date 自定义当前时间，默认为今天
	 * @property {Boolean} lunar 显示农历
	 * @property {String} startDate 日期选择范围-开始日期
	 * @property {String} endDate 日期选择范围-结束日期
	 * @property {String} mode = [不传 | multiple | range ]  多个日期 | 选择日期范围 默认单日期
	 * @property {Boolean} insert = [true|false] 插入模式,默认为false
	 * 	@value true 弹窗模式
	 * 	@value false 插入模式
	 * @property {Boolean} clearDate = [true|false] 弹窗模式是否清空上次选择内容
	 * @property {Array} selected 打点，期待格式[{date: '2019-06-27', info: '签到', data: { custom: '自定义信息', name: '自定义消息头',xxx:xxx... }}]
	 * @property {String} cancelColor 取消按钮颜色
	 * @property {String} confirmColor  确认按钮颜色，默认#3c9cff
	 * @property {String} title 头部工具条中间的标题文字
	 * @property {String} color 主题色，默认#3c9cff
	 * @property {Number} round :insert="false"时的圆角
	 * @property {Boolean} closeOnClickOverlay 点击遮罩是否关闭
	 * @property {String} startText range为true时，第一个日期底部的提示文字
	 * @property {String} endText range为true时，最后一个日期底部的提示文字
	 * @property {String} readonly 是否为只读状态，只读状态下禁止选择日期，默认false
	 * 
	 * @event {Function} change 日期改变，`insert :ture` 时生效
	 * @event {Function} confirm 确认选择`insert :false` 时生效
	 * @event {Function} monthSwitch 切换月份时触发
	 * 
	 * @property {Boolean}		readonly 是否只读
	 * @example <uv-calendar :insert="true":lunar="true" :start-date="'2019-3-2'":end-date="'2019-5-20'"@change="change" />
	 */
	
	import { withDefaults, ref, getCurrentInstance, onMounted, nextTick } from 'vue';
	
	import { PropsModel, propsDefault } from './props';
	
	const { proxy } = getCurrentInstance() as any;
	const props = withDefaults(defineProps<PropsModel>(), propsDefault);
	const emit = defineEmits(['close', 'cancel', 'update:modelValue', 'confirm']);
	
	const date = ref(['', ''])	//  自定义当前时间，期待格式['2019-06-27', '2019-06-28']
	
	function open() {
		if(Array.isArray(props.modelValue)) {
			date.value = [...props.modelValue];
		}
		proxy.$refs.calendarsRange.open();
	}
	function onConfirm({ range }) {
		const dateRange = [range.before, range.after];
		date.value = [...dateRange];
		emit('update:modelValue', [...dateRange]);
	}
	function close() {
		proxy.$refs.calendarsRange.close();
	}
	function onClose() {}
	function onChange() {}
	function onMonthSwitch() {}
	function formatData(value: any, schema: any) {
		if(Array.isArray(value)) {
			return value.join('~');
		}
	}
</script>

<template>
	<view class="calendars-range">
		<view v-if="readonly">
			<uv-input :value="formatData(modelValue, schema)"
				border="bottom" readonly
				:placeholder="schema.componentProps.placeholder"
			></uv-input>
		</view>
		<view @tap.stop="open" v-else>
			<uv-input :value="formatData(modelValue, schema)"
				border="surround" readonly suffixIcon="arrow-down"
				:placeholder="schema.componentProps.placeholder"
			></uv-input>
		</view>
		
		<uv-calendars 
			ref="calendarsRange"
			:date="date"
			:lunar="lunar"
			:mode="mode"
			:insert="insert"
			:clearDate="clearDate"
			:selected="selected"
			:startDate="startDate"
			:endDate="endDate"
			:showMonth="showMonth"
			:round="round"
			:color="color"
			:confirmColor="confirmColor"
			:cancelColor="cancelColor"
			:closeOnClickOverlay="closeOnClickOverlay"
			:startText="startText"
			:endText="endText"
			:allowSameDay="allowSameDay"
			:readonly="readonly"
			
			@confirm="onConfirm"
			@close="onClose"
			@change="onChange"
			@monthSwitch="onMonthSwitch"
		/>
	</view>
</template>

<style scoped>

</style>
