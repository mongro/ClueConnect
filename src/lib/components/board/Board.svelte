<script lang="ts">
	import socket from '$lib/socket';
	import type { GameState, Player } from '$shared/src/types';
	import Button from '../button/button.svelte';
	import GameControls from './GameControls.svelte';
	import { Pointer } from 'lucide-svelte';
	import Card from './Card.svelte';
	import Suggestions from './Suggestions.svelte';

	interface Props {
		gameState: GameState;
		myState: Player;
		playerState: Player[];
	}

	let { gameState, myState, playerState }: Props = $props();

	function giveClue(word: string, number: number) {
		socket.emit('giveClue', word, number);
	}

	function makeGuess(cardId: number) {
		socket.emit('makeGuess', cardId);
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

	function endGuessing() {
		socket.emit('endGuessing');
	}

	function toggleSuggestion(cardId: number) {
		if (!isGuessing()) return;
		socket.emit('toggleSuggestion', cardId);
	}
</script>

<div class="col-span-3 flex flex-col items-center gap-4">
	<div class="grid aspect-2 w-full grid-cols-5 grid-rows-5 gap-2">
		{#each gameState.board as card, index}
			<Card
				type={card.type}
				word={card.word}
				revealed={card.revealed}
				spymaster={myState.role === 'spymaster'}
				onclick={() => toggleSuggestion(index)}
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
				<Suggestions suggestions={gameState.suggestions[index] ?? []} {playerState} />
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
