<script lang="ts">
	import socket from '$lib/socket';
	import type { Player, Role } from '$shared/src/types';
	import type { Snippet } from 'svelte';
	import Button from '../button/button.svelte';
	import OnlineStatus from '../OnlineStatus.svelte';
	interface Props {
		player: Player;
		myState: Player | null;
		rightSide?: Snippet<[Player, Player | null]>;
	}

	let { player, myState, rightSide }: Props = $props();
</script>

<div class="mb-1 flex items-center justify-between rounded bg-primary p-2 text-base lg:text-lg">
	<div class="flex items-center">
		<OnlineStatus online={player.isConnected} />
		<span>{player.name}</span>
		{#if player.isHost}
			<span class="ml-2 text-xs">-HOST-</span>
		{/if}
	</div>
	{#if rightSide}
		{@render rightSide(player, myState)}
	{/if}
</div>
