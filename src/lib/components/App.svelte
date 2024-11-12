<script lang="ts">
	import socket from '../socket';
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

		socket.on('gameUpdate', (server_game_state) => {
			gameState = server_game_state;
		});

		socket.on('playerUpdate', (serverPlayerState) => {
			playerState = serverPlayerState;
		});

		socket.on('myStatus', (serverMyState) => {
			myState = serverMyState;
		});
	}

	function syncWithLobby(id: string) {
		const credentials = LocalStorageHelper.getLobbyEntry(id);
		if (credentials) socket.emit('joinLobby', id, credentials);
	}

	async function join(name: string) {
		try {
			const myHeaders = new Headers();
			myHeaders.append('Content-Type', 'application/json');

			const res = await fetch('http://localhost:5000/joinLobby', {
				method: 'POST',
				body: JSON.stringify({ name, lobbyId }),
				headers: myHeaders
			});
			if (!res.ok) {
				throw new Error(`Response status: ${res.status}`);
			}

			const response = await res.json();
			LocalStorageHelper.setLobbyEntry(response.lobbyId, response.credentials);
			syncWithLobby(response.lobbyId);
		} catch (error) {
			console.error(error);
		}
	}
</script>

<div class="mx-auto max-w-screen-2xl bg-slate-600">
	{#if gameState && myState}
		<div>
			<StatusHeader
				currentTeam={gameState.currentTeam}
				winner={gameState.winner}
				myRole={myState.role}
				myTeam={myState.team}
				inGuessPhase={gameState.currentClue !== null}
			/>
		</div>
	{/if}
	<div class=" grid grid-cols-5 gap-4 pt-4">
		{#if !myState}
			<JoinCard handleJoin={join} />
		{/if}
		{#if gameState && myState}
			<TeamsDisplay score={gameState.score} {myState} {teams} />
		{/if}
		{#if gameState && myState}
			<Board {gameState} {myState} />
		{/if}

		<EventLog messages={gameState ? gameState.log : []}>
			{#snippet row(d)}
				<Message message={d} />
			{/snippet}
		</EventLog>
	</div>
</div>
