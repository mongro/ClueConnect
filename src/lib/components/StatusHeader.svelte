<script lang="ts">
	import type { Role, Team } from '$shared/src/types';
	import { _ } from 'svelte-i18n';
	import type { TransitionConfig } from 'svelte/transition';

	interface Props {
		currentTeam: Team;
		inGuessPhase: boolean;
		winner: Team | null;
	}
	import { lobby } from '$lib/lobby.svelte';

	let { currentTeam, inGuessPhase, winner }: Props = $props();

	let message = $derived(createMessage());

	function typewriter(node: Element, { speed = 1 }): TransitionConfig {
		const text = node.textContent;
		const valid = node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE;

		if (!valid || !text) {
			throw new Error(`This transition only works on elements with a single text node child`);
		}

		const duration = text.length / (speed * 0.01);

		return {
			duration,
			tick: (t: number) => {
				const i = Math.trunc(text.length * t);
				node.textContent = text.slice(0, i);
			}
		};
	}
	function createMessage() {
		let { myRole, myTeam } = lobby;
		if (winner) {
			return $_('winnerMessage', { values: { winner } });
		}
		if (myTeam === undefined) {
			return $_(`messageStatusNoTeam.${inGuessPhase ? 'operative' : 'spymaster'}`, {
				values: { team: currentTeam }
			});
		}
		if (currentTeam === myTeam) {
			if (myRole === 'spymaster' && inGuessPhase) return $_('waitingForGuess');
			if (myRole === 'operative' && inGuessPhase) return $_('makeGuess');
			if (myRole === 'spymaster' && !inGuessPhase) return $_('givingClue');
			if (myRole === 'operative' && !inGuessPhase) return $_('waitingForClue');
		}
		return $_(`messageStatusOpponentTeam.${inGuessPhase ? 'operative' : 'spymaster'}`);
	}
</script>

<div class="mt-2 flex h-8 select-none items-center justify-center sm:mt-4 sm:h-12">
	{#key message}
		<div
			class="rounded bg-white p-1 text-center text-base sm:p-2 sm:text-2xl"
			in:typewriter={{ speed: 2 }}
		>
			{message}
		</div>
	{/key}
</div>
