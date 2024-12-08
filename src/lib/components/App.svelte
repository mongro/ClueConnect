<script lang="ts">
	import socket from '../socket';
	import { _ } from 'svelte-i18n';
	import type { GameState, Player } from '$shared/src/types';
	import { onDestroy } from 'svelte';
	import EventLog from './EventLog.svelte';
	import Message from './Message.svelte';
	import StatusHeader from './StatusHeader.svelte';
	import TeamsDisplay from './team/Teams.svelte';
	import Board from './board/Board.svelte';
	import Header from './Header.svelte';
	import CopyToClipboard from './CopyToClipboard.svelte';
	import SetupGame from './SetupGame.svelte';
	import { getLobbyState } from '$lib/lobby.svelte';
	interface Props {
		gameState: GameState;
		players: Player[];
	}
	let { gameState, players }: Props = $props();
	const lobby = getLobbyState();
	onDestroy(() => {
		console.log('disconnect client');
		socket.disconnect();
	});
</script>

<div class="mx-auto flex h-full max-w-screen-2xl flex-col px-2">
	<div>
		<Header />
		<StatusHeader
			currentTeam={gameState.currentTeam}
			winner={gameState.winner}
			inGuessPhase={gameState.currentClue !== null}
			hasStarted={gameState.board.length > 0}
		/>
	</div>
	<div
		class=" mt-2 grid flex-grow grid-cols-5 grid-rows-[max-content_1fr] gap-4 sm:mt-4 lg:grid-rows-1"
	>
		<TeamsDisplay score={gameState.score} />
		<div class="col-span-5 col-start-1 lg:col-span-3 lg:col-start-2 lg:row-start-1">
			{#if gameState.board.length > 0}
				<Board {gameState} />
			{:else if lobby.myState && lobby.myState.isHost}
				<SetupGame />
			{/if}
		</div>
		<div class="col-span-3 row-start-2 flex flex-col gap-2 lg:row-start-1">
			<div class="hidden flex-col items-center rounded bg-secondary p-2 sm:flex">
				<span class="mr-2">{$_('copyToClipboard')}</span>
				<CopyToClipboard />
			</div>
			<EventLog messages={gameState.log}>
				{#snippet row(d)}
					<Message message={d} />
				{/snippet}
			</EventLog>
		</div>
	</div>
</div>
