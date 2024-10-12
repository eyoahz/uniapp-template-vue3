<script setup lang="ts">
	import { withDefaults, ref, getCurrentInstance, onMounted, nextTick } from 'vue';
	// @ts-ignore
	import dayjs from '@/uni_modules/uv-ui-tools/libs/util/dayjs';
	
	import { uploadApi } from '@/common/api/system';
	import { PropsModel, propsDefault } from './props';
	import { isNil } from '@/common/utils/is';
	import { DateTimePickerMode, DateTimePickerRawMode, TimeType, FieldType } from './type';
	import PickerSingle from './components/PickerSingle/PickerSingle.vue';
	import PickerMultiple from './components/PickerMultiple/PickerMultiple.vue';
	import CalendarsRange from './components/CalendarsRange/CalendarsRange.vue';
	import ApiPickerSingle from './components/ApiPickerSingle/ApiPickerSingle.vue';
	import ApiPickerMultiple from './components/ApiPickerMultiple/ApiPickerMultiple.vue';
	
	const { proxy } = getCurrentInstance() as any;
	const props = withDefaults(defineProps<PropsModel>(), propsDefault)
	const emit = defineEmits();
	const zyForm = ref<any>(null);
	
	const formFieldMap = new Map();
	const apiTransferKey = ['ApiPickerSingle', 'ApiPickerMultiple'];
	const formModal = ref<Record<string, any>>({});	// 表单数据
	const rules = ref<Record<string, any>>({});	// 表单规则
	const formMode = ref<Record<string, any>>({})	// 表单初始数据（根据 schemas 对象中的 defaultValue 字段提取，默认为 ''）
	const formSchemas = ref<any[]>([])	// 表单配置
	
	function init(schemas = []) {
		formSchemas.value = props.schemas.length != 0
			? formSchemas.value = proxy.$uv.deepClone(props.schemas)
			: formSchemas.value = schemas;
		formSchemas.value.forEach((schema) => {
			formMode.value[schema.field] = proxy.$uv.deepClone(schema.defaultValue ?? '');
			formModal.value[schema.field] = proxy.$uv.deepClone(schema.defaultValue ?? '');
			rules.value[schema.field] = proxy.$uv.deepClone(schema.rules ?? []);
			formFieldMap.set(schema.field, schema);
			apiTransferKey.includes(schema.component) && apiTransferInit(schema);
		})
		nextTick(async () => {
			await nextTick();
			// 如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则
			zyForm.value.setRules(rules);
		})
	}
	function handleEvent(eventName = 'change', data: any, schema = {}) {
		emit(eventName, data, schema, 
			{ 
				setFieldsValue,
				resetFields,
			},
		);
	}
	
	// #region DatetimePicker 日期时间选择
	const time = ref<TimeType>({
		dateTimePicker: dayjs().valueOf(),
		datePicker: dayjs().valueOf(),
		timePicker: dayjs().format('HH:MM'),
		yearMonthPicker: dayjs().valueOf(),
	})
	const field = ref<FieldType>({
		dateTimePicker: '',
		datePicker: '',
		timePicker: '',
		yearMonthPicker: '',
	})
	async function dateTimePickerOpen(mode: DateTimePickerMode, schema: any) {
		if(formModal.value[schema.field]) {
			if(mode === 'timePicker') {
				time.value[mode] = formModal.value[schema.field];
			} else {
				time.value[mode] = dayjs(formModal.value[schema.field]).valueOf();
			}
		} else {
			if(mode === 'timePicker') {
				time.value[mode] = dayjs().format("HH:MM")
			} else {
				time.value[mode] = dayjs().valueOf();
			}
		}
		await nextTick();
		proxy.$refs[mode].init();
		proxy.$refs[mode].open();
		field.value[mode] = schema.field;
	}
	async function dateTimePickerConfirm({ value, mode }: { value: string, mode: DateTimePickerRawMode }, field: string) {
		enum EnumMode {
			datetime = 'dateTimePicker',
			date = 'datePicker',
			time = 'timePicker',
			'year-month' = 'yearMonthPicker',
		}
		let modeAlias: DateTimePickerMode = EnumMode[mode]
		await nextTick();
		switch (modeAlias) {
			case 'dateTimePicker':
				formModal.value[field] = dayjs(value).format('YYYY-MM-DD hh:mm');
				break;
			case 'datePicker':
				formModal.value[field] = dayjs(value).format('YYYY-MM-DD');
				break;
			case 'timePicker':
				formModal.value[field] = value;
				break;
			case 'yearMonthPicker':
				formModal.value[field] = dayjs(value).format('YYYY-MM');
				break;
		}
	}
	// #endregion DatetimePicker 日期时间选择
	
	// #region Radio 单选框组件
	function radioGroupChange(value: string, schema: any) {
		handleEvent(schema.componentProps.eventName, value, schema);
	}
	// #endregion Radio 单选框组件
	
	// #region Checkbox 复选框组件
	function checkboxGroupChange(detail: Array<string>, schema: any) {
		handleEvent(schema.componentProps.eventName, detail, schema);
	}
	// #endregion Checkbox 复选框组件
	
	// #region Picker 单列、多列选择
	function pickerConfirm({ value }: any, schema: any) {
		handleEvent(schema.componentProps.eventName, value, schema);
	}
	// #endregion Picker 单列、多列选择
	
	/* #region CalendarsRange 日历范围选择 */
	function calendarsRangeConfirm(value: any, schema: any) {
		handleEvent(schema.componentProps.eventName, value, schema);
	}
	/* #endregion CalendarsRange 日历范围选择 */
	
	// #region Upload 上传组件
	function uploadOversize(schema: any) {
		proxy.$uv.toast(`文件大小不能超过${Math.floor(schema.componentProps.maxSize / 1024 /1024)}M`)
	}
	function uploadDelete({ index }: { index: number }, schema: any) {
		formModal.value[schema.field].splice(index, 1);
	}
	async function uploadAfterRead(e: any, schema: any) {
		try{
			!proxy.$uv.test.array(formModal.value[schema.field]) 
				&& (formModal.value[schema.field] = []);
			const { file: { name, size, url } } = e;
			uni.showLoading({
				title: '上传中',
				mask: true
			});
			const res = await uploadApi({
				filePath: url
			});
			formModal.value[schema.field].push({
				url: res?.data?.url,
				name: name ?? res?.data?.fileName,
				fileName: name ?? res?.data?.fileName
			})
			uni.hideLoading();
		}catch(e){
			console.log(e)
			proxy.$uv.toast('上传错误');
		}
	}
	// #endregion Upload 上传组件
	
	// #region api传递
	async function apiTransferInit(schema: any) {
		await nextTick();
		switch (schema?.component){
			case 'ApiPickerSingle':
				proxy.$refs[`apiPickerSingle${schema.field}`][0].init(schema?.componentProps?.api);
				break;
			case 'ApiPickerMultiple':
				proxy.$refs[`apiPickerMultiple${schema.field}`][0].init(schema?.componentProps?.api);
				break;
		}
	}
	// #endregion api传递
	
	// #region ApiPickerSingle api单列选择
	function apiPickerSingleConfirm({ value }: any, schema: any) {
		handleEvent(schema.componentProps.eventName, value, schema);
	}
	// #endregion ApiPickerSingle api单列选择
	
	// #region ApiPickerSingle api多列选择
	function apiPickerMultipleConfirm({ value }: any, schema: any) {
		handleEvent(schema.componentProps.eventName, value, schema);
	}
	// #endregion ApiPickerSingle api多列选择
	
	// 获取所有表单值
	function getFieldsValue() {
		return proxy.$uv.deepClone(formModal.value);
	}
	// 设置表单值
	function setFieldsValue(data: Record<string, any> = {}) {	// 参数： { schema.field]: value }
		Object.keys(data).forEach(key => {
			if(formModal.value.hasOwnProperty(key)) {
				formModal.value[key] = data[key];
			}
		})
	}
	// 重置表单值
	function resetFields() {
		zyForm.value.resetFields();
		zyForm.value.clearValidate();
		Object.assign(formModal.value, proxy.$uv.deepClone(formMode.value));
	}
	
	onMounted(() => {
		(props.schemas.length != 0) && init();
	})
	
	defineExpose({
		init
	})
</script>

<template>
	<view class="zy-form">
		<uv-form ref="zyForm" :model="formModal" :rules="rules"
			:labelPosition="labelPosition"
			:borderBottom="borderBottom"
		>
			<template v-for="schema in formSchemas" :key="schema.field">
				<view v-show="isNil(schema.show) ? true : schema.show">
					<uv-form-item
						:label="schema.label" :prop="schema.field" :borderBottom="schema.borderBottom"
						:required="schema.required" :labelWidth="schema.labelWidth || 'auto'"
						:labelPosition="schema.labelPosition || 'top'" :rightIcon="schema.rightIcon || ''"
						:leftIcon="schema.leftIcon || ''" :leftIconStyle="schema.leftIconStyle"
					>
						<!-- Input 输入框  -->
						<template v-if="schema.component === 'Input'">
							<view v-if="schema.componentProps.readonly || readonly" style="width: 100%"
							 @tap="(data: any) => handleEvent(schema.componentProps.eventName, data, schema)"
							>
								<uv-input v-model="formModal[schema.field]" :type="schema.componentProps.type || 'text'"
									:disabled="schema.componentProps.disabled" :disabledColor="schema.componentProps.disabledColor || '#f5f7fa'"
									:clearable="schema.componentProps.clearable" :placeholder="schema.componentProps.placeholder || '请输入'"
									:ignoreCompositionEvent="schema.componentProps.ignoreCompositionEvent" 
									:cursor="schema.componentProps.cursor" :cursorSpacing="schema.componentProps.cursorSpacing"
									:prefixIcon="schema.componentProps.prefixIcon || ''" :prefixIconStyle="schema.componentProps.prefixIconStyle"
									:suffixIcon="schema.componentProps.suffixIcon || ''" :suffixIconStyle="schema.componentProps.suffixIconStyle"
									:border="schema.componentProps.border || 'bottom'" readonly
									:shape="schema.componentProps.shape || 'square'" 
									:customStyle="schema.componentProps.customStyle"
								></uv-input>
							</view>
							<view v-else  style="width: 100%">
								<uv-input v-model="formModal[schema.field]" :type="schema.componentProps.type || 'text'"
									:disabled="schema.componentProps.disabled" :disabledColor="schema.componentProps.disabledColor || '#f5f7fa'"
									:clearable="schema.componentProps.clearable" :placeholder="schema.componentProps.placeholder || '请输入'"
									:ignoreCompositionEvent="schema.componentProps.ignoreCompositionEvent" 
									:cursor="schema.componentProps.cursor" :cursorSpacing="schema.componentProps.cursorSpacing"
									:prefixIcon="schema.componentProps.prefixIcon || ''" :prefixIconStyle="schema.componentProps.prefixIconStyle"
									:suffixIcon="schema.componentProps.suffixIcon || ''" :suffixIconStyle="schema.componentProps.suffixIconStyle"
									:border="schema.componentProps.border || 'surround'"
									:shape="schema.componentProps.shape || 'square'" :customStyle="schema.componentProps.customStyle"
									@change="(data: any) => handleEvent(schema.componentProps.eventName, data, schema)"
								></uv-input>
							</view>
						</template>
						
						<!-- Textarea 文本域 -->
						<template v-else-if="schema.component === 'InputTextArea'">
							<view style="width: 100%">
								<uv-textarea v-if="schema.componentProps.readonly || readonly" autoHeight disabled v-model="formModal[schema.field]"></uv-textarea>
								<uv-textarea v-else v-model="formModal[schema.field]"
									:placeholder="schema.componentProps.placeholder || '请输入'" :height="schema.componentProps.height"
									:disabled="schema.componentProps.disabled" :count="schema.componentProps.count"
									:autoHeight="schema.componentProps.autoHeight"
									@input="(data: any) => handleEvent(schema.componentProps.eventName, data, schema)"
								></uv-textarea>
							</view>
						</template>
						
						<!-- #region 时间日期选择 -->
						<!-- DatetimePicker 时间日期选择 mode='datatime' -->
						<template v-else-if="schema.component === 'DatetimePicker'">
							<uv-input v-if="schema.componentProps.readonly || readonly" readonly 
								:border="schema.componentProps.border || 'bottom'" :value="formModal[schema.field]"
							></uv-input>
							<view v-else style="width: 100%"
								@tap="() => dateTimePickerOpen('dateTimePicker', schema)"
							>
								<uv-input :value="formModal[schema.field]"
									border="surround" readonly suffixIcon="arrow-down"
									:placeholder="schema.componentProps.placeholder || '请选择'"
								></uv-input>
							</view>
						</template>
						
						<!-- DatetimePicker 时间日期选择 mode='date' -->
						<template v-else-if="schema.component === 'DatePicker'">
							<uv-input v-if="schema.componentProps.readonly || readonly" readonly 
								:border="schema.componentProps.border || 'bottom'" :value="formModal[schema.field]"
							></uv-input>
							<view v-else style="width: 100%"
								@tap="() => dateTimePickerOpen('datePicker', schema)"
							>
								<uv-input :value="formModal[schema.field]"
									border="surround" readonly suffixIcon="arrow-down"
									:placeholder="schema.componentProps.placeholder || '请选择'"
								></uv-input>
							</view>
						</template>
						
						<!-- DatetimePicker 时间日期选择 mode='time' -->
						<template v-else-if="schema.component === 'TimePicker'">
							<uv-input v-if="schema.componentProps.readonly || readonly" readonly 
								:border="schema.componentProps.border || 'bottom'" :value="formModal[schema.field]"
							></uv-input>
							<view v-else style="width: 100%"
								@tap="() => dateTimePickerOpen('timePicker', schema)"
							>
								<uv-input :value="formModal[schema.field]"
									border="surround" readonly suffixIcon="arrow-down"
									:placeholder="schema.componentProps.placeholder || '请选择'"
								></uv-input>
							</view>
						</template>
						
						<!-- DatetimePicker 时间日期选择 mode='year-month' -->
						<template v-else-if="schema.component === 'YearMonthPicker'">
							<uv-input v-if="schema.componentProps.readonly || readonly" readonly 
								:border="schema.componentProps.border || 'bottom'" :value="formModal[schema.field]"
							></uv-input>
							<view v-else style="width: 100%"
								@tap="() => dateTimePickerOpen('yearMonthPicker', schema)"
							>
								<uv-input :value="formModal[schema.field]"
									border="surround" readonly suffixIcon="arrow-down"
									:placeholder="schema.componentProps.placeholder || '请选择'"
								></uv-input>
							</view>
						</template>
						<!-- #endregion 时间日期选择 -->
						
						<!-- Radio 单选框 -->
						<template v-else-if="schema.component === 'Radio'">
							<uv-radio-group v-model="formModal[schema.field]"
								:placement="schema.componentProps.placement || 'column'"
								:disabled="schema.componentProps.readonly || readonly"
								size="30rpx" iconSize="20rpx" labelSize="30rpx"
								@change="(e: string) => radioGroupChange(e, schema)"
							>
								<uv-radio v-for="radio in schema.componentProps.options"
									:key="radio.value" :label="radio.label" :name="radio.value"
									:customStyle="radio.customStyle ||  'margin: 0 8px 8px 0'"
									:disabled="radio.disabled"
								></uv-radio>
							</uv-radio-group>
						</template>
						
						<!-- Checkbox 复选框 -->
						<template v-else-if="schema.component === 'Checkbox'">
							<uv-checkbox-group v-model="formModal[schema.field]"
								:placement="schema.componentProps.placement || 'column'"
								:shape="schema.componentProps.shape || 'square'"
								:disabled="schema.componentProps.readonly || readonly"
								size="30rpx" iconSize="20rpx" labelSize="30rpx"
								@change="(e: Array<string>) => checkboxGroupChange(e, schema)"
							>
								<uv-checkbox v-for="checkbox in schema.componentProps.options"
									:key="checkbox.value" :label="checkbox.label" :name="checkbox.value"
									:customStyle="checkbox.customStyle ||  'marginBottom: 8px'"
								></uv-checkbox>
							</uv-checkbox-group>
						</template>
						
						<!-- #region 单列选择 -->
						<template v-else-if="schema.component === 'PickerSingle'">
							<view style="width: 100%">
								<PickerSingle v-model="formModal[schema.field]" :ref="`pickerSingle${schema.field}`" :schema="schema"
									@confirm="(e: any) => pickerConfirm(e, schema)" :readonly="schema.componentProps.readonly || readonly"
								></PickerSingle>
							</view>
						</template>
						<!-- #endregion 单列选择 -->
						
						<!-- #region 多列选择 -->
						<template v-else-if="schema.component === 'PickerMultiple'">
							<view style="width: 100%">
								<PickerMultiple v-model="formModal[schema.field]" :ref="`pickerMultiple${schema.field}`" :schema="schema"
									@confirm="(e: any) => pickerConfirm(e, schema)" :readonly="schema.componentProps.readonly || readonly"
								></PickerMultiple>
							</view>
						</template>
						<!-- #endregion 多列选择 -->
						
						<!-- #region 日历日期范围选择 -->
						<template v-else-if="schema.component === 'CalendarsRange'">
							<view style="width: 100%">
								<CalendarsRange v-model="formModal[schema.field]" :ref="`calendarsRange${schema.field}`" :schema="schema"
									@confirm="(e: any) => calendarsRangeConfirm(e, schema)" :readonly="schema.componentProps.readonly || readonly"
								></CalendarsRange>
							</view>
						</template>
						<!-- #endregion 日历日期范围选择 -->
						
						<!-- Upload 上传 -->
						<template v-else-if="schema.component === 'Upload'">
							<view v-if="schema.componentProps.readonly || readonly">
								<uv-upload width="160rpx" height="160rpx" uploadIconSize="52rpx"
									:deletable="false" :maxCount="(formModal[schema.field] || []).length || 1"
									:fileList="formModal[schema.field] || []" :imageMode="schema.componentProps.imageMode || 'aspectFill'"
									:fileName="schema.componentProps.fileName" :disabled="true" uploadText="数据为空" uploadIcon="close"
								></uv-upload>
							</view>
							<uv-upload v-else :fileList="formModal[schema.field] || []" width="160rpx" height="160rpx" uploadIconSize="52rpx"
								:maxSize="schema.componentProps.maxSize || 10485760" :accept="schema.componentProps.accept || 'image'"
								:capture="schema.componentProps.capture || ['album', 'camera']"
								:maxCount="schema.componentProps.maxCount" :disabled="schema.componentProps.disabled"
								:imageMode="schema.componentProps.imageMode || 'aspectFill'" :uploadText="schema.componentProps.uploadText || ''"
								:fileName="schema.componentProps.fileName"
								@oversize="() => uploadOversize(schema)"
								@delete="(e: any) => uploadDelete(e, schema)"
								@afterRead="(e: any) => uploadAfterRead(e, schema)"
							></uv-upload>
						</template>
						
						<!-- #region api单列选择 -->
						<template v-else-if="schema.component === 'ApiPickerSingle'">
							<view>
								<ApiPickerSingle v-model="formModal[schema.field]" :ref="`apiPickerSingle${schema.field}`" :schema="schema"
									@confirm="(e: any) => apiPickerSingleConfirm(e, schema)" :readonly="schema.componentProps.readonly || readonly"
								></ApiPickerSingle>
							</view>
						</template>
						<!-- #endregion api单列选择 -->
						
						<!-- #region api多列选择 -->
						<template v-else-if="schema.component === 'ApiPickerMultiple'">
							<view style="width: 100%">
								<ApiPickerMultiple v-model="formModal[schema.field]" :ref="`apiPickerMultiple${schema.field}`" :schema="schema"
									@confirm="(e: any) => apiPickerMultipleConfirm(e, schema)" :readonly="schema.componentProps.readonly || readonly"
								></ApiPickerMultiple>
							</view>
						</template>
						<!-- #endregion api多列选择 -->
					
					</uv-form-item>
				</view>
			</template>
		</uv-form>
		
		<!-- #region 时间日期选择组件 -->
		<!-- DatetimePicker 时间日期选择 mode='datetime' -->
		<uv-datetime-picker ref="dateTimePicker" mode="datetime"
			v-model="time.dateTimePicker"
			closeOnClickOverlay
			@confirm="(e: any) => dateTimePickerConfirm(e, field.dateTimePicker)"
		></uv-datetime-picker>
		
		<!-- DatetimePicker 时间日期选择 mode='date' -->
		<uv-datetime-picker ref="datePicker" mode="date"
			v-model="time.datePicker"
			closeOnClickOverlay
			@confirm="(e: any) => dateTimePickerConfirm(e, field.datePicker)"
		></uv-datetime-picker>
		
		<!-- DatetimePicker 时间日期选择 mode='time' -->
		<uv-datetime-picker ref="timePicker" mode="time"
			v-model="time.timePicker"
			closeOnClickOverlay
			@confirm="(e: any) => dateTimePickerConfirm(e, field.timePicker)"
		></uv-datetime-picker>
		
		<!-- DatetimePicker 时间日期选择 mode='year-month' -->
		<uv-datetime-picker ref="yearMonthPicker" mode="year-month"
			v-model="time.yearMonthPicker"
			closeOnClickOverlay
			@confirm="(e: any) => dateTimePickerConfirm(e, field.yearMonthPicker)"
		></uv-datetime-picker>
		<!-- #endregion 时间日期选择组件 -->
		
	</view>
</template>

<style lang="scss" scoped>

</style>