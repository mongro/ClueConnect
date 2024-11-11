<script lang="ts">
	import ClueDisplay from './ClueDisplay.svelte';
	import Button from './button/button.svelte';
	import ClueInput from './ClueInput.svelte';
	import type { Clue, Team } from '$shared/src/types';
	interface Props {
		currentClue: Clue | null;
		currentTeam: Team;
		isGivingClue: boolean;
		isGuessing: boolean;
		endGuessing: () => void;
		giveClue: (word: string, number: number) => void;
	}
	let { currentClue, currentTeam, isGivingClue, isGuessing, endGuessing, giveClue }: Props =
		$props();
</script>

{#if currentClue}
	<ClueDisplay clue={currentClue.clue} number={currentClue.number} team={currentTeam} />
{/if}
{#if isGivingClue}
	<ClueInput sendClue={giveClue} />
{/if}
{#if isGuessing}
	<div class="flex items-center justify-center">
		<Button size="lg" onclick={endGuessing} variant="destructive">End guessing</Button>
	</div>
{/if}
