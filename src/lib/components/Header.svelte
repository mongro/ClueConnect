<script lang="ts">
	import socket from '$lib/socket';
	import Button from './button/button.svelte';
	import { lobby } from '$lib/lobby.svelte';
	import { UserRound } from 'lucide-svelte';
	import PlayersCard from './PlayersCard.svelte';
	import { clickOutside } from '$lib/actions/clickOutside';

	let showPlayersCard = $state(false);
	function restart() {
		socket.emit('resetGame');
	}
	function resetTeams() {
		socket.emit('resetTeams');
	}

	function closeShowPlayers() {
		showPlayersCard = false;
	}
	function openShowPlayers() {
		showPlayersCard = true;
	}
</script>

<div class="relative flex items-center gap-2">
	{#if showPlayersCard}
		<PlayersCard close={closeShowPlayers} />
	{/if}

	<Button onclick={openShowPlayers}><UserRound /><span>{lobby.players.length}</span></Button>
	{#if lobby.myState?.isHost}
		<Button onclick={restart}>Reset Game</Button>
		<Button onclick={resetTeams}>Reset Teams</Button>
	{/if}
</div>
