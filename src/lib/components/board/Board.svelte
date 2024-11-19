<script lang="ts">
	import socket from '$lib/socket';
	import type { GameState, Player } from '$shared/src/types';
	import Button from '../button/button.svelte';
	import GameControls from './GameControls.svelte';
	import { Pointer } from 'lucide-svelte';
	import Card from './Card.svelte';
	import Suggestions from './Suggestions.svelte';
	import { lobby } from '$lib/players.svelte';

	interface Props {
		gameState: GameState;
	}

	let { gameState }: Props = $props();

	function giveClue(word: string, number: number) {
		socket.emit('giveClue', word, number);
	}

	function makeGuess(cardId: number) {
		socket.emit('makeGuess', cardId);
	}

	function isGuessing() {
		return (
			lobby.myRole === 'operative' &&
			lobby.myTeam === gameState?.currentTeam &&
			gameState?.currentClue !== null
		);
	}

	function isGivingClue() {
		return (
			lobby.myTeam === gameState?.currentTeam &&
			gameState?.currentClue === null &&
			lobby.myRole === 'spymaster'
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

<div
	class="col-span-5 col-start-1 flex flex-col items-center gap-4 lg:col-span-3 lg:col-start-2 lg:row-start-1"
>
	<div class="grid w-full grid-cols-5 gap-1 sm:gap-2">
		{#each gameState.board as card, index}
			<Card
				type={card.type}
				word={card.word}
				revealed={card.revealed}
				onclick={() => toggleSuggestion(index)}
			>
				{#snippet button(revealed: boolean, flip: () => void)}
					{#if isGuessing() || revealed}
						<Button
							onclick={() => {
								if (!revealed) makeGuess(index);
								else flip();
							}}
							class="absolute right-0 top-0"
							size="icon"
							variant="outline"><Pointer /></Button
						>
					{/if}
				{/snippet}
				<Suggestions suggestions={gameState.suggestions[index] ?? []} />
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
