<script setup lang="ts">
	import { useAppStore } from '@/common/store/modules/app';
	import { storeToRefs } from 'pinia';
	
	const appStore = useAppStore();
	
	const { tabbarList,tabbarDefault } = storeToRefs(appStore);
	
	function handleChange(name: string) {
		appStore.setTabbarDefault(name)
	}
</script>

<template>
	<view>
		<uv-tabbar :value="tabbarDefault" @change="handleChange">
			<template v-for="item in tabbarList" :key="item.name">
				<template v-if="item.icon">
					<uv-tabbar-item  :name="item.name" :text="item.text" :icon="item.icon"
						:iconSize="item.iconSize" :dot="item.dot" :badge="item.badge"></uv-tabbar-item>
				</template>
				<template v-else>
					<uv-tabbar-item :name="item.name" :text="item.text" :dot="item.dot"
						:badge="item.badge">
						<template v-slot:active-icon>
							<uv-icon customPrefix="custom-icon" :name="item.customIcon" :iconSize="item.iconSize" color="#3894FF"></uv-icon>
						</template>
						<template v-slot:inactive-icon>
							<uv-icon customPrefix="custom-icon" :name="item.customIcon" :iconSize="item.iconSize"></uv-icon>
						</template>
					</uv-tabbar-item>
				</template>
			</template>
		</uv-tabbar>
	</view>
	
</template>

<style>
</style>