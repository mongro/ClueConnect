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

<div class="mb-1 flex items-center rounded bg-primary p-2 text-lg">
	<OnlineStatus online={player.isConnected} />{player.name}
	{#if myState.isHost && !player.isHost}
		<Button onclick={() => kickPlayer(player.id)}>Kick</Button>
		<Button onclick={() => makeHost(player.id)}>Make Host</Button>
	{/if}
</div>
