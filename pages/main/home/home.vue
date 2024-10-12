<script setup lang="ts">
	import { ref, onMounted, getCurrentInstance } from 'vue'
	import { LoginParamsModel } from '@/common/api/user/model';
	import { getCaptchaApi, loginApi } from '@/common/api/user';
	import { uploadApi, downloadApi } from '@/common/api/system';
	import { getCustomGradeList, getRegionList } from '@/common/api/form';
	import { useAppStore } from '@/common/store/modules/app';
	import { useUserStore } from '@/common/store/modules/user';
	import ZyTabbar from '@/components/zy-tabbar/zy-tabbar.vue';
	
	import { createUniStorage } from '@/common/utils/cache'
	
	const appStore = useAppStore();
	const user = useUserStore();
	
	const { proxy } = getCurrentInstance() as any;
	
	const uniStorage = createUniStorage();
	uniStorage.set('token', '你妈死了')
	
	const loginParams = ref<LoginParamsModel>({
		username: '蔡志家',
		password: 'hengxing@520',
		code: '',
		uuid: '',
	})
	const img = ref('')
	
	onMounted(async () => {
		try{
			const { data } = await getCaptchaApi();
			img.value = data.img && `data:image/gif;base64,${data.img}`;
			loginParams.value.uuid = data.uuid;
			
			console.log(proxy.$refs, 123)
			proxy.$refs.zyForm.init(schemas.value);
		}catch(e){
			console.log(e)
			//TODO handle the exception
		}
	})
	
	
	async function handleLogin() {
		try{
			user.userLogin(() => loginApi({ ...loginParams.value }))
			// user.getUserInfo()
			// user.logout();
		}catch(e){
			//TODO handle the exception
		}
	}
	
	function handleLogout() {
		user.logout();
	}
	
	function afterRead(event: any) {
		console.log(event.file)
		uploadApi({ filePath: event.file[0].url, name: 'file'})
	}
	
	async function download() {
		// const res = await downloadApi('https://crm-xmyc.oss-cn-beijing.aliyuncs.com/2024/09/25/d5e48c29d7844d9dae24648f12025e78.png')
		user.setAuth(Date.now() + '')
		appStore.tabbarDefault = 'photo'
	}
	
	function logout() {
		console.log('退出登录')
	}
	
	function onChange() {}
	function onClick() {}
	
	const schemas = ref([
		{
			label: '项目',
			field: 'project',
			component: 'Input',
			required: true,
			defaultValue: '项目名称',
			rules: [
				{
					type: 'string',
					required: true, 
					message: '请输入项目',
					trigger: ['change','blur'],
				},
			],
			componentProps: {
				eventName: 'click',	// 传出的事件名称，代表在 <zy-form> 上可以触发 @click 自定义事件（！！！注意是自定义事件）
				readonly: true,
				suffixIcon: 'arrow-right',
			}
		},
		{
			label: '项目2',
			field: 'project2',
			component: 'Input',
			required: true,
			defaultValue: '项目名称',
			rules: [
				{
					type: 'string',
					required: true, 
					message: '请输入项目',
					trigger: ['change','blur'],
				},
			],
			componentProps: {
				// eventName: 'click',	// 传出的事件名称，代表在 <zy-form> 上可以触发 @click 自定义事件（！！！注意是自定义事件）
			}
		},
		{
			label: '项目文本域',
			field: 'projectTextArea',
			component: 'InputTextArea',
			required: true,
			defaultValue: '项目文本域',
			rules: [
				{
					type: 'string',
					required: true, 
					message: '请输入项目文本域',
					trigger: ['change','blur'],
				},
			],
			componentProps: {},
		},
		{
			label: '年月日时分选择',
			field: 'datetimePicker',
			component: 'DatetimePicker',
			required: true,
			defaultValue: '',
			rules: [
				{
					type: 'string',
					required: true, 
					message: '请选择年月日时分',
					trigger: ['change','blur'],
				},
			],
			componentProps: {}
		},
		{
			label: '年月日选择',
			field: 'datePicker',
			component: 'DatePicker',
			required: true,
			defaultValue: '',
			rules: [
				{
					type: 'string',
					required: true, 
					message: '请选择年月日',
					trigger: ['change','blur'],
				},
			],
			componentProps: {}
		},
		{
			label: '时分选择',
			field: 'timePicker',
			component: 'TimePicker',
			required: true,
			defaultValue: '',
			rules: [
				{
					type: 'string',
					required: true, 
					message: '请选择时分',
					trigger: ['change','blur'],
				},
			],
			componentProps: {}
		},
		{
			label: '年月选择',
			field: 'yearMonthPicker',
			component: 'YearMonthPicker',
			required: true,
			defaultValue: '',
			rules: [
				{
					type: 'string',
					required: true, 
					message: '请选择年月',
					trigger: ['change','blur'],
				},
			],
			componentProps: {}
		},
		{
			label: 'Radio',
			field: 'Radio',
			component: 'Radio',
			required: true,
			defaultValue: 'apple',
			rules: [
				{
					type: 'string',
					required: true, 
					message: '请选择Radio1',
					trigger: ['change','blur'],
				},
			],
			componentProps: {
				// placement: 'column',
				options: [
					{ label: '苹果', value: 'apple' },
					{ label: '香蕉', value: 'banana' },
					{ label: '橙子', value: 'orange' },
				]
			}
		},
		{
			label: 'Checkbox',
			field: 'Checkbox',
			component: 'Checkbox',
			required: true,
			defaultValue: ['apple'],
			rules: [
				{
					type: 'array',
					required: true, 
					message: '请选择Checkbox',
					trigger: ['change','blur'],
				},
			],
			componentProps: {
				// placement: 'column',
				eventName: 'change',
				options: [
					{ label: '苹果', value: 'apple' },
					{ label: '香蕉', value: 'banana' },
					{ label: '橙子', value: 'orange' },
				]
			}
		},
		{
			label: '单列选择',
			field: 'PickerSingle',
			component: 'PickerSingle',
			required: true,
			defaultValue: '',
			rules: [
				{
					type: 'string',
					required: true, 
					message: '单列选择',
					trigger: ['change','blur'],
				},
			],
			componentProps: {
				labelField: 'text',
				valueField: 'id',
				options: [
					{
						id: 'c',
						text: 'c',
					},
					{
						id: 'c-1',
						text: 'c-1'
					},
					{
						id: 'c-2',
						text: 'c-2'
					},
					{
						id: 'd',
						text: 'd',
					},
				],
			},
		},
		{
			label: '多列选择',
			field: 'PickerMultiple',
			component: 'PickerMultiple',
			required: true,
			// defaultValue: '',
			rules: [
				{
					type: 'string',
					required: true, 
					message: '请选择PickerMultiple',
					trigger: ['change','blur'],
				},
			],
			componentProps: {
				labelField: 'text',
				valueField: 'id',
				options: [
					{
						parentId: '0',
						id: 'c',
						text: 'c',
						children: [
							{
								parentId: 'c',
								id: 'c-1',
								text: 'c-1'
							},{
								parentId: 'c',
								id: 'c-2',
								text: 'c-2'
							}
						]
					},{
						parentId: '0',
						id: 'd',
						text: 'd',
						children: [
							{
								parentId: 'd',
								id: 'd-1',
								text: 'd-1'
							}
						]
					},
				]
			}
		},
		{
			label: '日历范围选择',
			field: 'calendarsRange',
			component: 'CalendarsRange',
			required: false,
			defaultValue: ['2019-06-27', '2019-06-28'],	//	期望格式：['2019-06-27', '2019-06-28']
			rules: [],
			componentProps: {}
		},
		{
			label: 'Upload1',
			field: 'Upload1',
			component: 'Upload',
			required: true,
			defaultValue: [
				// {
				// 	fileName: 'main.png',
				// 	name: 'main.png',
				// 	url: 'https://crm-xmyc.oss-cn-beijing.aliyuncs.com/2024/04/23/560539d0ec1c44378aac1dd6e0425e29.png',
				// },
				// {
				// 	fileName: 'main.png',
				// 	name: 'main.png',
				// 	url: 'https://crm-xmyc.oss-cn-beijing.aliyuncs.com/2024/04/23/560539d0ec1c44378aac1dd6e0425e29.png',
				// },
			],
			rules: [
				{
					type: 'array',
					required: true, 
					message: '请上传文件',
					trigger: ['change','blur'],
				},
			],
			componentProps: {
				readonly: false,
				maxCount: 10,
				fileName: 'fileName',	// 是否展示文件名称
				// maxSize: 2097152,
			}
		},
		{
			label: 'api单列选择',
			field: 'apiPickerSingle',
			component: 'ApiPickerSingle',	// 用这个组件时，需要用this.$refs.zyForm.init(schemas)初始化，而不是用props传递schemas（uniapp中props无法传递函数）
			required: false,
			defaultValue: '',
			rules: [],
			componentProps: {
				api: getCustomGradeList,
				labelField: 'name',
				valueField: 'id',
				// resultField: '',	// 期望格式：'aaa' 或 'aaa.bbb.ccc'
				// border: 'none',	//	边框类型，surround-四周边框，bottom-底部边框，none-无边框
				// inputAlign: 'left',	// 输入框内容对齐方式 left | center | right
			}
		},
		{
			label: 'api多列选择',
			field: 'apiPickerMultiple',
			component: 'ApiPickerMultiple',	// 用这个组件时，需要用this.$refs.zyForm.init(schemas)初始化，而不是用props传递schemas（uniapp小程序中props无法传递函数）
			required: false,
			defaultValue: '',
			rules: [],
			componentProps: {
				api: getRegionList,
				labelField: 'name',
				valueField: 'id',
				// resultField: '',	// 期望格式：'aaa' 或 'aaa.bbb.ccc'
			}
		},
		
	])
	
	function handleChange(data, schema, event) {
		console.log(data, schema, event)
	}
</script>

<template>
	<view class="content">
		<uv-image :src="img" mode="scaleToFill"></uv-image>
		<view class="text-area">
			<uv-input v-model="loginParams.code"></uv-input>
		</view>
		<uv-button type="primary" text="登录" @click="handleLogin"></uv-button>
		<uv-button type="warning" text="退出" @click="handleLogout"></uv-button>
		
		<uv-upload
			name="1"
			multiple 
			:maxCount="10"
			@afterRead="afterRead" 
		></uv-upload>
		
		<uv-button type="error" text="下载" @click="download"></uv-button>
		
		<zy-form ref="zyForm" labelWidth="auto" @change="handleChange"></zy-form>
		
		<ZyTabbar></ZyTabbar>
	</view>
</template>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
