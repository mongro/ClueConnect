<script lang="ts">
	import socket from '../socket';
	import { goto } from '$app/navigation';

	import { page } from '$app/stores';
	import type {
		ServerToClientEvents,
		ClientToServerEvents,
		GameState,
		Role,
		Team,
		Player,
		TeamComposition
	} from '$shared/src/types';
	import { onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import EventLog from './EventLog.svelte';
	import Message from './Message.svelte';
	import JoinCard from './JoinCard.svelte';
	import StatusHeader from './StatusHeader.svelte';
	import TeamsDisplay from './team/Teams.svelte';
	import { LocalStorageHelper } from './LocalStorageHelper';
	import Board from './board/Board.svelte';
	import JoinLobbyCard from './JoinLobbyCard.svelte';
	let gameState = $state<GameState>();
	let playerState = $state<Player[]>([]);
	let myState = $state<Player | null>(null);

	let teams = $derived.by(() => {
		let teams: TeamComposition = {
			red: { operative: [], spymaster: [] },
			blue: { operative: [], spymaster: [] }
		};
		for (let i = 0; i < playerState.length; i++) {
			const { role, team } = playerState[i];
			if (team && role) {
				teams[team][role].push(playerState[i]);
			}
		}
		return teams;
	});
	const lobbyId = $page.params.id;

	if (browser) {
		const credentials = LocalStorageHelper.getLobbyEntry(lobbyId);
		if (credentials) socket.emit('joinLobby', lobbyId, credentials);

		onDestroy(() => {
			socket.disconnect();
		});
		socket.on('suggestionsUpdate', (serverSuggestionsState) => {
			if (gameState) gameState.suggestions = serverSuggestionsState;
		});
		socket.on('gameUpdate', (serverGameState) => {
			gameState = serverGameState;
		});

		socket.on('playerUpdate', (serverPlayerState) => {
			playerState = serverPlayerState;
			if (myState) myState = serverPlayerState[myState.id];
		});

		socket.on('myStatus', (serverMyState) => {
			myState = serverMyState;
		});

		socket.on('kick', () => {
			goto('/');
		});
	}
</script>

<div class="mx-auto max-w-screen-2xl">
	{#if !myState || !gameState}
		<JoinLobbyCard {lobbyId} />
	{:else}
		<div>
			<StatusHeader
				currentTeam={gameState.currentTeam}
				winner={gameState.winner}
				myRole={myState.role}
				myTeam={myState.team}
				inGuessPhase={gameState.currentClue !== null}
			/>
		</div>
		<div class=" grid grid-cols-5 gap-4 pt-4">
			<TeamsDisplay score={gameState.score} {myState} {teams} />

			<Board {gameState} {myState} {playerState} />

			<EventLog messages={gameState.log}>
				{#snippet row(d)}
					<Message message={d} />
				{/snippet}
			</EventLog>
		</div>
	{/if}
</div>
