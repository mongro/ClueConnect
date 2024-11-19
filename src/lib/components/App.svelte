<script lang="ts">
	import socket from '../socket';
	import { goto } from '$app/navigation';
	import { lobby } from '$lib/lobby.svelte';

	import { page } from '$app/stores';
	import type { GameState } from '$shared/src/types';
	import { onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import EventLog from './EventLog.svelte';
	import Message from './Message.svelte';
	import StatusHeader from './StatusHeader.svelte';
	import TeamsDisplay from './team/Teams.svelte';
	import { LocalStorageHelper } from './LocalStorageHelper';
	import Board from './board/Board.svelte';
	import JoinLobbyCard from './JoinLobbyCard.svelte';
	import Header from './Header.svelte';
	import CopyToClipboard from './CopyToClipboard.svelte';

	let gameState = $state<GameState>();
	const lobbyId = $page.params.id;
	if (browser) {
		const credentials = LocalStorageHelper.getLobbyEntry(lobbyId);
		if (credentials) {
			socket.connect();
			socket.emit('joinLobby', lobbyId, credentials);
		}

		onDestroy(() => {
			console.log('Disconnect');
			socket.disconnect();
		});

		socket.on('disconnect', function () {
			console.log('disconnect');
		});
		socket.on('connect', function () {
			console.log('connect');
		});
		socket.on('suggestionsUpdate', (serverSuggestionsState) => {
			if (gameState) gameState.suggestions = serverSuggestionsState;
		});
		socket.on('gameUpdate', (serverGameState) => {
			gameState = serverGameState;
		});

		socket.on('kick', () => {
			goto('/');
		});
	}
</script>

<div class="mx-auto flex h-full max-w-screen-2xl flex-col px-2">
	{#if !lobby.myState || !gameState || !lobby.players}
		<JoinLobbyCard {lobbyId} />
	{:else}
		<div>
			<Header />
			<StatusHeader
				currentTeam={gameState.currentTeam}
				winner={gameState.winner}
				inGuessPhase={gameState.currentClue !== null}
			/>
		</div>
		<div
			class=" mt-2 grid flex-grow grid-cols-5 grid-rows-[max-content_1fr] gap-4 sm:mt-4 lg:grid-rows-1"
		>
			<TeamsDisplay score={gameState.score} />

			<Board {gameState} />
			<div class="col-span-3 row-start-2 flex flex-col gap-2 lg:row-start-1">
				<div class="hidden flex-col items-center rounded bg-secondary p-2 sm:flex">
					<span class="mr-2">Send this link to invite other players.</span>
					<CopyToClipboard />
				</div>
				<EventLog messages={gameState.log}>
					{#snippet row(d)}
						<Message message={d} />
					{/snippet}
				</EventLog>
			</div>
		</div>
	{/if}
</div>
