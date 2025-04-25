<script lang="ts">
	import type { Player } from '$shared/src/types';
	import { scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { suggestionVariants } from './variants.js';
	import { getLobbyState } from '$lib/lobby.svelte.js';

	interface Props {
		suggestions: number[];
	}
	let { suggestions }: Props = $props();
	const lobby = getLobbyState();
	let suggestingPlayers = $derived.by(() => {
		let player = suggestions.map((id) => lobby.players.find((player) => player.id === id));
		return player.filter((player) => player !== undefined);
	});
</script>

<div class={'absolute left-2 top-2 flex flex-wrap items-center text-xs'}>
	{#each suggestingPlayers as player (player.id)}
		<div
			class={suggestionVariants({ team: player.team })}
			in:scale={{ duration: 400 }}
			animate:flip
		>
			{player.name}
		</div>
	{/each}
</div>
