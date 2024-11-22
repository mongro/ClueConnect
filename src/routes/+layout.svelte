<script lang="ts">
	import '../app.css';
	import '$lib/i18n';
	import type { PageData } from './$types';
	import { locale } from 'svelte-i18n';
	import { browser } from '$app/environment';

	let { children, data } = $props();
	console.log('set', data.lang);
	locale.set(data.lang);
</script>

<div class="relative h-screen">
	<div class="background absolute inset-0 bg-cover">
		{@render children()}
	</div>
</div>

<style>
	.background {
		background-image: url('$lib/images/pattern.svg');
	}
</style>
