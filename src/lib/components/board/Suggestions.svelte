<script lang="ts">
	import type { Player } from '$shared/src/types';
	import { scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { suggestionVariants } from './variants.js';

	interface Props {
		suggestions: number[];
		playerState: Player[];
	}
	let { suggestions, playerState }: Props = $props();

	let players = $derived.by(() => {
		let player = suggestions.map((id) => playerState.find((player) => player.id === id));
		return player.filter((player) => player !== undefined);
	});
</script>

<div class={'absolute left-2 top-2 flex flex-wrap items-center text-xs'}>
	{#each players as player (player.id)}
		<div
			class={suggestionVariants({ team: player.team })}
			in:scale={{ duration: 400 }}
			animate:flip
		>
			{player.name}
		</div>
	{/each}
</div>
