<script setup lang="ts">
	/**
	 * u-picker
	 * @description 选择器
	 * @property {Array}			schema				纲要，例如： { componentProps: {} }
	 * @property {Boolean}			show				是否显示picker弹窗（默认 false ）
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
	 * @property {Array}			defaultIndex		各列的默认索引
	 * @property {Boolean}			immediateChange		是否在手指松开时立即触发change事件（默认 false ）
	 * @event {Function} close		关闭选择器时触发
	 * @event {Function} cancel		点击取消按钮触发
	 * @event {Function} confirm	点击确定按钮，返回当前选择的值
	 * 
	 * @property {Boolean}		readonly 是否只读
	 */
	
	import { withDefaults, ref, getCurrentInstance, onMounted, nextTick } from 'vue';
	
	import { PropsModel, propsDefault } from './props';
	
	const { proxy } = getCurrentInstance() as any;
	const props = withDefaults(defineProps<PropsModel>(), propsDefault);
	const emit = defineEmits(['close', 'cancel', 'update:modelValue', 'confirm']);
	const optionsMap = new Map();
	
	const defaultValue = ref('');	// 默认初始值
	const labelFiled = ref('text');	// 选项对象中，需要展示的属性键名（默认 'text' ）
	const valueField = ref('value');	// 选项对象中，对应值的属性键名（默认 'value' ）
	const defaultIndex = ref<number[]>([]); // 单列的默认索引
	const columns = ref<Array<[]>>([]); // 单列数据  [[第1列]]
	
	// 初始化
	function init() {
		optionsMap.clear();
		labelFiled.value = props.schema?.componentProps?.labelField ?? 'text';
		valueField.value = props.schema?.componentProps?.valueField ?? 'value';
		columns.value = Array.isArray(props.schema?.componentProps?.options)
			? [proxy.$uv.deepClone(props.schema?.componentProps?.options)] 
			: [[]];
		
		const options = props.schema?.componentProps?.options;
		const getOptionsMap = (data = [], column = 0) => {
			data.forEach((item, index) => {
				if(item.parentId == 0) column = 0;
				optionsMap.set(String(item[valueField.value]), { ...item, column, index })
				if(Array.isArray(item?.children) && item.children.length) {
					getOptionsMap(item.children, ++column);
				} 
			})
		}
		getOptionsMap(options);
		
		const getDefaultValue = (data: Record<string, any> = {}, valueFieldParams: string = valueField.value) => {
			defaultValue.value = data[valueFieldParams];
			if(Array.isArray(data?.children) && data.children.length) {
				getDefaultValue(data.children[0])
			}
		}
		getDefaultValue(options[0]);
	}
	
	//#region 用于控制选择器的弹出与收起
	function open() {
		const value = props.modelValue || defaultValue.value;
		let indexs: number[] = [];
		const options = props.schema?.componentProps?.options;
		
		const getIndex = (value: any) => {
			const option = optionsMap.get(value);
			indexs.unshift(option.index ?? 0);
			if(option.parentId != 0) getIndex(option.parentId);
		}
		getIndex(value);
		
		let defaultIndexMode = [...indexs];
		let list = [];
		defaultIndexMode.forEach((item: number, index) => {
			if(index == 0) {
				list.push(options);
			} else {
				list.push(options[defaultIndexMode[--index]].children);
			}
		})
		columns.value = list;
		
		const picker = proxy.$refs.pickerMultiple;
		columns.value.forEach((item: Array<number>, index: number) => {
			picker.setColumnValues(index, item);
		})
		
		nextTick(async () => {
			defaultIndex.value = defaultIndexMode;
			await nextTick();
			proxy.$refs.pickerMultiple.open();
		});
	}
	function close() {
		proxy.$refs.pickerMultiple.close();
	}
	//#endregion 用于控制选择器的弹出与收起
	
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
	async function  onChange(e: any) {
		const {
			columnIndex,
			value,
			values, // values为当前变化列的数组内容
			index,
			// 微信小程序无法将picker实例传出来，只能通过ref操作
			picker = proxy.$refs.pickerMultiple
		} = e;
		// 当某一列变化时，改变其后一列对应的选项
		// value[columnIndex] 当前变化项
		columns.value.splice(columnIndex + 1);
		await nextTick();
		const linkage = (currentValue: any) => {
			if(Array.isArray(currentValue?.children)) {
				columns.value.push(currentValue.children);
				linkage(currentValue.children?.[0])
			}
		}
		linkage(value[columnIndex]);
		columns.value.forEach((item: any, index: number) => {
			if(index > columnIndex) {
				picker.setColumnValues(index, item);
			}
		})
	}
	// value 映射 label
	function formatData(val: string, schema: any) {
		const obj = optionsMap.get(val);
		return obj?.[labelFiled.value] ?? val;
	}
	
	onMounted(() => {
		init();
	})

</script>

<template>
	<view class="picker-multiple">
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
		
		<uv-picker
			ref='pickerMultiple'
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