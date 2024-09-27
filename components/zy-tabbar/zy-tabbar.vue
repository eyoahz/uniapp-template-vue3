<script setup lang="ts">
	import { useAppStore } from '@/common/store/modules/app';
	import { storeToRefs } from 'pinia';
	
	const appStore = useAppStore();
	
	const { tabbarList,tabbarDefault } = storeToRefs(appStore);
	
	function handleChange(name: string, item: any) {
		console.log(name, item)
		tabbarDefault.value = name;
	}
</script>

<template>
	<view>
		<uv-tabbar :value="tabbarDefault">
			<uv-tabbar-item 
				v-for="item in tabbarList" 
				:key="item.name"
				:name="item.name"
				:text="item.text" 
				:icon="item.icon"
				@click="(name: string) => handleChange(name, item)"
			></uv-tabbar-item>
		</uv-tabbar>
	</view>
	
</template>

<style>
</style>