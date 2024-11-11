<script lang="ts">
	import { io, Socket } from 'socket.io-client';
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
	import Card from './Card.svelte';
	import EventLog from './EventLog.svelte';
	import Message from './Message.svelte';
	import ClueInput from './ClueInput.svelte';
	import ClueDisplay from './ClueDisplay.svelte';
	import JoinCard from './JoinCard.svelte';
	import StatusHeader from './StatusHeader.svelte';
	import Button from './button/button.svelte';
	import { Pointer } from 'lucide-svelte';
	import TeamsDisplay from './team/Teams.svelte';
	import GameControls from './GameControls.svelte';
	import { LocalStorageHelper } from './LocalStorageHelper';
	const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:5000');
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

	function isGuessing() {
		return (
			myState?.role === 'operative' &&
			myState.team === gameState?.currentTeam &&
			gameState?.currentClue !== null
		);
	}

	function isGivingClue() {
		return (
			myState?.team === gameState?.currentTeam &&
			gameState?.currentClue === null &&
			myState?.role === 'spymaster'
		);
	}
	function joinRoleAndTeam(role: Role, team: Team) {
		socket.emit('joinTeamAndRole', team, role);
	}

	function giveClue(word: string, number: number) {
		socket.emit('giveClue', word, number);
	}

	function makeGuess(cardId: number) {
		socket.emit('makeGuess', cardId);
	}

	function endGuessing() {
		socket.emit('endGuessing');
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
			<TeamsDisplay score={gameState.score} {joinRoleAndTeam} {myState} {teams} />
		{/if}
		{#if gameState}
			<div class="col-span-3 flex flex-col items-center gap-4">
				<div class="grid aspect-2 w-full grid-cols-5 grid-rows-5 gap-2">
					{#each gameState.board as card, index}
						<Card
							type={card.type}
							word={card.word}
							revealed={card.revealed}
							spymaster={myState?.role === 'spymaster'}
						>
							{#snippet button()}
								{#if isGuessing()}
									<Button
										onclick={() => makeGuess(index)}
										class="absolute right-0"
										size="icon"
										variant="outline"><Pointer /></Button
									>
								{/if}
							{/snippet}
						</Card>
					{/each}
				</div>
				<GameControls
					currentClue={gameState.currentClue}
					currentTeam={gameState.currentTeam}
					isGuessing={isGuessing()}
					isGivingClue={isGivingClue()}
					{endGuessing}
					{giveClue}
				/>
			</div>
		{/if}

		<EventLog messages={gameState ? gameState.log : []}>
			{#snippet row(d)}
				<Message message={d} />
			{/snippet}
		</EventLog>
	</div>
</div>
