<script setup lang="ts">
import { withDefaults } from 'vue';

const props = withDefaults(defineProps<{
	msg?: string;
	buttonText?: string;
}>(), {
	msg: '???',
	buttonText: '点击'
})

function onClick() {
	console.log('HelloWorld.vue')
}

</script>

<template>
	<view>
		<header>
			<slot name="header">Default Header</slot>
		</header>
		<main>
			<slot name="content" :msg="msg">Default Content</slot>
		</main>
		<footer>
			<slot name="footer">Default footer</slot>
		</footer>
		
		<button @click="onClick">{{ buttonText }}</button>
	</view>
</template>

<style scoped>

</style>