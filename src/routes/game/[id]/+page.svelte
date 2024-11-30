<script lang="ts">
	import App from '$lib/components/App.svelte';
	import { browser } from '$app/environment';
	import { LocalStorageHelper } from '$lib/components/LocalStorageHelper';
	import socket from '$lib/socket';
	import { page } from '$app/stores';
	import JoinLobbyCard from '$lib/components/JoinLobbyCard.svelte';
	import type { PageData } from './$types';
	import { setLobbyState } from '$lib/lobby.svelte';

	const lobbyId = $page.params.id;
	let credentials = $state(browser ? LocalStorageHelper.getLobbyEntry(lobbyId) : '');
	let { data }: { data: PageData } = $props();
	const { players, game } = data;
	const lobby = setLobbyState(game, players);

	if (browser) {
		if (credentials) {
			socket.connect();
			socket.emit('joinLobby', lobbyId, credentials);
		}
	}
</script>

{#if lobby.gameState && lobby.myState}
	<App {...data} gameState={lobby.gameState} players={lobby.players} />
{:else}
	<JoinLobbyCard {lobbyId} />
{/if}
