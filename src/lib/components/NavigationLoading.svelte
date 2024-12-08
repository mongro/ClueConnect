<script lang="ts">
	import LoadingDots from './LoadingDots.svelte';

	interface Props {
		text: string;
	}

	let { text }: Props = $props();
</script>

<div class="flex h-screen items-center justify-center">
	<div class="flex items-center justify-center space-x-1 rounded bg-white p-4">
		<span class="mr-2 text-xl">{text}</span>
		<LoadingDots size="sm" />
	</div>
</div>
