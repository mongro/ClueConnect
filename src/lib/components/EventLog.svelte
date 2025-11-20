<script lang="ts" generics="T">
	import { tick, type Snippet } from 'svelte';
	import { _ } from 'svelte-i18n';

	interface Props {
		messages: T[];
		row: Snippet<[T]>;
	}

	let { messages, row }: Props = $props();
	let container: HTMLDivElement;
	let autoScroll = $state(true);

	$effect.pre(() => {
		messages.length;
		autoScroll =
			container && container.offsetHeight + container.scrollTop > container.scrollHeight - 50;

		if (autoScroll) {
			tick().then(() => {
				container.scrollTo(0, container.scrollHeight);
			});
		}
	});
</script>

<div class=" mb-2 flex max-h-96 grow flex-col overflow-hidden rounded bg-white shadow-xl">
	<div class="flex-none text-center text-xl">Event Log</div>
	<div bind:this={container} class="flex-auto overflow-y-auto">
		{#each messages as message}
			<div>{@render row(message)}</div>
		{/each}
	</div>
</div>
