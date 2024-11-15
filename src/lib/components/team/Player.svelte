<script lang="ts">
	import socket from '$lib/socket';
	import type { Player, Role } from '$shared/src/types';
	import Button from '../button/button.svelte';
	import OnlineStatus from '../OnlineStatus.svelte';
	interface Props {
		player: Player;
		myState: Player;
	}

	let { player, myState }: Props = $props();

	function kickPlayer(id: number) {
		socket.emit('kickPlayer', id);
	}
	function makeHost(id: number) {
		socket.emit('makeHost', id);
	}
</script>

<div class="mb-1 flex items-center justify-between rounded bg-primary p-2 text-lg">
	<div class="flex items-center">
		<OnlineStatus online={player.isConnected} />{player.name}
	</div>
	{#if myState.isHost && !player.isHost}
		<div class="flex items-center gap-1">
			<Button size="sm" onclick={() => kickPlayer(player.id)} variant="destructive">Kick</Button>
			<Button size="sm" onclick={() => makeHost(player.id)} variant="secondary">Make Host</Button>
		</div>
	{/if}
</div>
