<script lang="ts">
	import { onDestroy, type Snippet } from 'svelte';
	interface Props {
		delay?: number;
		children?: Snippet;
	}
	let show = $state(false);

	let { children, delay = 400 }: Props = $props();

	const timeoutId = window.setTimeout(() => {
		show = true;
	}, delay);
	onDestroy(() => clearTimeout(timeoutId));
</script>

{#if show}
	{@render children?.()}
{/if}
