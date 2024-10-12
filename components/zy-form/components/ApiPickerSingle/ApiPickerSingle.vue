<script setup lang="ts">
	/**
	 * u-picker
	 * @description 选择器
	 * @property {Array}			schema				纲要，例如： { componentProps: {} }
	 * @property {Boolean}			showToolbar			是否显示顶部的操作栏（默认 true ）
	 * @property {String}			title				顶部标题
	 * @property {String | Number}			round				弹窗圆角
	 * @property {Boolean}			loading				是否显示加载中状态（默认 false ）
	 * @property {String | Number}	itemHeight			各列中，单个选项的高度（默认 44 ）
	 * @property {String}			cancelText			取消按钮的文字（默认 '取消' ）
	 * @property {String}			confirmText			确认按钮的文字（默认 '确定' ）
	 * @property {String}			cancelColor			取消按钮的颜色（默认 '#909193' ）
	 * @property {String}			confirmColor		确认按钮的颜色（默认 '#3c9cff' ）
	 * @property {String}			color		文字颜色（默认 '' ）
	 * @property {String}			activeColor		选中文字的颜色（默认 '' ）
	 * @property {String | Number}	visibleItemCount	每列中可见选项的数量（默认 5 ）
	 * @property {Boolean}			closeOnClickOverlay	是否允许点击遮罩关闭选择器（默认 false ）
	 * @property {Boolean}			closeOnClickConfirm		是否允许点击确认关闭选择器（默认 true ）
	 * @property {Array}			defaultIndex		各列的默认索引
	 * @property {Boolean}			immediateChange		是否在手指松开时立即触发change事件（默认 false ）
	 * @event {Function} close		关闭选择器时触发
	 * @event {Function} cancel		点击取消按钮触发
	 * @event {Function} confirm	点击确定按钮，返回当前选择的值
	 * 
	 * @property {Boolean}		readonly 是否只读
	 */
	
	import { withDefaults, ref, getCurrentInstance, onMounted } from 'vue';
	
	import { PropsModel, propsDefault } from './props';
	import { isFunction } from '@/common/utils/is';
	
	const { proxy } = getCurrentInstance() as any;
	const props = withDefaults(defineProps<PropsModel>(), propsDefault);
	const emit = defineEmits(['close', 'cancel', 'update:modelValue', 'confirm']);
	
	const labelFiled = ref('text');	// 选项对象中，需要展示的属性键名（默认 'text' ）
	const valueField = ref('value');	// 选项对象中，对应值的属性键名（默认 'value' ）
	const defaultIndex = ref<number[]>([]); // 单列的默认索引
	const columns = ref<Array<any[]>>([]); // 单列数据  [[第1列]]
	const resultField = ref('');	// 对接口返回的结果中，需要获取的数据的键名
	const selectOptions = ref<Array<any>>([]);	// 接口返回的数组数据
	const iconLoading = ref(true);
	
	// 初始化
	function init(api: any) {
		labelFiled.value = props.schema?.componentProps?.labelField ?? 'text';
		valueField.value = props.schema?.componentProps?.valueField ?? 'value';
		resultField.value = props.schema?.componentProps?.resultField;
		getPickerOptions(api);
	}
	
	async function getPickerOptions(api: any) {
		if (!api || !isFunction(api)) return;
		try{
			const res = await api();
			selectOptions.value = resultField.value 
				? proxy.$uv.getProperty(res, resultField.value)
				: res;
			
			columns.value = Array.isArray(selectOptions.value)
				? [selectOptions.value]
				: [[]];
			iconLoading.value = false;
		}catch(e){
			console.log(e)
		}
	}
	
	// #region 用于控制选择器的弹出与收起
	function open() {
		const value = props.modelValue ?? '';
		const obj = columns.value[0].find((m, index) => {
			if (m[valueField.value] == value) {
				defaultIndex.value = [index];
			}
		});
		proxy.$refs.pickerSingle.open();
	}
	function close() {
		proxy.$refs.pickerSingle.close();
	}
	// #endregion 用于控制选择器的弹出与收起
	
	function onClose() {
		emit('close');
	}
	function onCancel() {
		emit('cancel');
	}
	function onConfirm(e: any) {
		const { value: list, indexs } = e;
		let valueList = [],
			labelList = [];
		list.map((item: any, index: number) => {
			valueList.push(item[valueField.value]);
			labelList.push(item[labelFiled.value]);
		});
		defaultIndex.value = indexs;	// Picker 组件用watch监测 defaultIndex，重新设置对应的值
		emit('update:modelValue', e.value.slice(-1)[0]?.[valueField.value]);
		emit('confirm', e);
	}
	function onChange() {}
	// value 映射 label
	function formatData(val: string, schema: any) {
		let selectOptionsMode = proxy.$uv.deepClone(selectOptions.value) || [];
		let obj = selectOptionsMode.find((m) => {
			return m[valueField.value] == val;
		});
		return obj?.[labelFiled.value] ?? val;
	}
	
	defineExpose({
		init,
	})
</script>

<template>
	<view class="picker-single">
		<template v-if="iconLoading">
			<uv-loading-icon></uv-loading-icon>
		</template>
		<template v-else>
			<view v-if="readonly">
				<uv-input :value="formatData(modelValue, schema)" readonly
					:placeholder="schema.componentProps.placeholder"
					:border="schema.componentProps.border || 'bottom'"
					:inputAlign="schema.componentProps.inputAlign || 'left'"
				></uv-input>
			</view>
			<view @tap.stop="open" v-else>
				<uv-input :value="formatData(modelValue, schema)"
					readonly suffixIcon="arrow-down"
					:placeholder="schema.componentProps.placeholder"
					:border="schema.componentProps.border || 'surround'"
					:inputAlign="schema.componentProps.inputAlign || 'left'"
				></uv-input>
			</view>
		</template>
		
		<uv-picker
			ref='pickerSingle'
			:showToolbar="showToolbar"
			:title="title"
			:round="round"
			:loading="loading"
			:itemHeight="itemHeight"
			:cancelText="cancelText"
			:confirmText="confirmText"
			:cancelColor="cancelColor"
			:confirmColor="confirmColor"
			:color="color"
			:activeColor="activeColor"
			:visibleItemCount="visibleItemCount"
			:closeOnClickOverlay="closeOnClickOverlay"
			:closeOnClickConfirm="closeOnClickConfirm"
			:immediateChange="immediateChange"
			
			:columns="columns"
			:defaultIndex="defaultIndex"
			:keyName="labelFiled"
			
			@close="onClose"
			@cancel="onCancel"
			@change="onChange"
			@confirm="onConfirm"
		></uv-picker>
	</view>
</template>

<style scoped>

</style>