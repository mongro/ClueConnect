<script lang="ts">
	import '../app.css';
	import '$lib/i18n';
	import { navigating } from '$app/stores';
	import Delayed from '$lib/components/Delayed.svelte';
	import NavigationLoading from '$lib/components/NavigationLoading.svelte';
	let { children } = $props();

	function isGameRoute(url: URL, params: Record<string, string> | null) {
		return url.pathname.startsWith('/game') && params?.id;
	}
</script>

<div class="relative h-screen">
	<div class="background absolute inset-0 bg-cover">
		{#if $navigating && $navigating.to && isGameRoute($navigating.to.url, $navigating.to.params)}
			<Delayed delay={200}>
				<NavigationLoading text="Loading Game" />
			</Delayed>
		{:else}
			{@render children()}
		{/if}
	</div>
</div>

<style>
	.background {
		background-image: url('$lib/images/pattern.svg');
	}
</style>
