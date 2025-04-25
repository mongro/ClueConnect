<script lang="ts">
	import socket from '$lib/socket';
	import Button from './button/button.svelte';
	import { getLobbyState } from '$lib/lobby.svelte';
	import { UserRound } from 'lucide-svelte';
	import PlayersCard from './PlayersCard.svelte';
	import { _ } from 'svelte-i18n';
	import LanguageSelect from './LanguageSelect.svelte';
	import RulesModal from './RulesModal.svelte';

	let showPlayersCard = $state(false);
	let lobby = getLobbyState();

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
	{#if getLobbyState().myState?.isHost}
		<Button onclick={restart}>{$_('resetGame')}</Button>
		<Button onclick={resetTeams}>{$_('resetTeams')}</Button>
	{/if}
	<LanguageSelect />
	<RulesModal />
</div>
