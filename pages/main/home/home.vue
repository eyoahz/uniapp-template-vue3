<script setup lang="ts">
	import { ref, onMounted } from 'vue'
	import { LoginParamsModel } from '@/common/api/user/model';
	import { getCaptchaApi, loginApi } from '@/common/api/user';
	import { uploadApi, downloadApi } from '@/common/api/system';
	import { useAppStore } from '@/common/store/modules/app';
	import { useUserStore } from '@/common/store/modules/user';
	import ZyTabbar from '@/components/zy-tabbar/zy-tabbar.vue';
	
	import { createUniStorage } from '@/common/utils/cache'
	import Child from './Child.vue'
	
	const appStore = useAppStore();
	const user = useUserStore();
	
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
		
		<Child buttonText="尼玛死了" @logout="logout">
			<template #header>
				头
			</template>
			<template #content>
				身
			</template>
			<template #footer>
				脚
			</template>
		</Child>
		
		<ZyTabbar></ZyTabbar>
	</view>
</template>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
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
