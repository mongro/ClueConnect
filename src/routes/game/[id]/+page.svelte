<script lang="ts">
	import App from '$lib/components/App.svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import JoinLobbyCard from '$lib/components/JoinLobbyCard.svelte';
	import type { PageData } from './$types';
	import { setLobbyState } from '$lib/lobby.svelte';
	import { getModalState } from '$lib/modalManager.svelte';

	const lobbyId = page.params.id;
	let { data }: { data: PageData } = $props();
	const { players, game } = data;
	const modalState = getModalState();
	const lobby = setLobbyState(lobbyId, players, game, modalState);
	if (browser) {
		lobby.connect();
	}
</script>

{#if lobby.gameState && lobby.credentials}
	<App {...data} gameState={lobby.gameState} players={lobby.players} />
{:else}
	<JoinLobbyCard {lobbyId} />
{/if}
