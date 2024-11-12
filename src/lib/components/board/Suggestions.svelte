<script lang="ts">
	interface Props {
		suggestions: string[];
	}
	let { suggestions }: Props = $props();
</script>

<div class="absolute left-2 top-2 flex flex-wrap items-center rounded text-xs">
	{#each suggestions as suggestion}
		<div>{suggestion}</div>
	{/each}
</div>
