<script lang="ts">
	import socket from '$lib/socket';
	import type { CardType, GameState, Player } from '$shared/src/types';
	import Button from '../button/button.svelte';
	import GameControls from './GameControls.svelte';
	import { Pointer } from 'lucide-svelte';
	import Card from './Card.svelte';
	import Suggestions from './Suggestions.svelte';
	import { getLobbyState } from '$lib/lobby.svelte';
	import { wordContainerVariants } from './variants';

	interface Props {
		gameState: GameState;
	}

	let { gameState }: Props = $props();
	let lobby = getLobbyState();

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
			lobby.gameState?.currentClue !== null &&
			!lobby.gameState?.gameover
		);
	}

	function isGivingClue() {
		return (
			lobby.myTeam === gameState?.currentTeam &&
			lobby.gameState?.currentClue === null &&
			lobby.myRole === 'spymaster' &&
			!lobby.gameState?.gameover
		);
	}

	function endGuessing() {
		socket.emit('endGuessing');
	}

	function toggleSuggestion(cardId: number) {
		if (!isGuessing()) return;
		console.log('emitToggle');
		socket.emit('toggleSuggestion', cardId);
	}
</script>

<div class=" flex w-full flex-col items-center gap-4">
	<div class="grid w-full grid-cols-5 gap-1 sm:gap-2">
		{#each gameState.board as card, index}
			<Card type={card.type} word={card.word} revealed={card.revealed}>
				{#snippet button(revealed: boolean)}
					{#if isGuessing() && !revealed}
						<Button
							onclick={() => {
								makeGuess(index);
							}}
							aria-label="guessCard"
							class="absolute top-0 right-0"
							size="icon"
							variant="outline"><Pointer /></Button
						>
					{/if}
				{/snippet}
				{#snippet suggestButton(revealed: boolean)}
					{#if isGuessing() && !revealed}
						<div
							role="button"
							aria-label="suggestCard"
							class=" absolute inset-0 bg-transparent"
							onclick={() => toggleSuggestion(index)}
							tabindex="0"
							onkeydown={() => toggleSuggestion(index)}
						></div>
					{/if}
				{/snippet}
				<Suggestions suggestions={gameState.suggestions[index] ?? []} />
			</Card>
		{/each}
	</div>
	{#if !gameState.gameover}
		<GameControls
			currentClue={gameState.currentClue}
			currentTeam={gameState.currentTeam}
			isGuessing={isGuessing()}
			isGivingClue={isGivingClue()}
			{endGuessing}
			{giveClue}
		/>
	{/if}
</div>
