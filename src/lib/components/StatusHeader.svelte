<script lang="ts">
	import type { Role, Team } from '$shared/src/types';
	import { _ } from 'svelte-i18n';
	import type { TransitionConfig } from 'svelte/transition';

	interface Props {
		currentTeam: Team;
		inGuessPhase: boolean;
		winner: Team | null;
		hasStarted: boolean;
	}
	import { getLobbyState } from '$lib/lobby.svelte';
	import LoadingDots from './LoadingDots.svelte';

	let { currentTeam, inGuessPhase, winner, hasStarted }: Props = $props();
	let lobby = getLobbyState();
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
		if (!hasStarted) {
			if (lobby.myState?.isHost) {
				return $_('setupMessageHost');
			} else return $_('setupMessage');
		}
		if (winner) {
			return $_('winnerMessage', { values: { winner } });
		}
		if (lobby.myTeam === undefined) {
			return $_(`messageStatusNoTeam.${inGuessPhase ? 'operative' : 'spymaster'}`, {
				values: { team: currentTeam }
			});
		}
		if (currentTeam === lobby.myTeam) {
			if (lobby.myRole === 'spymaster' && inGuessPhase) return $_('waitingForGuess');
			if (lobby.myRole === 'operative' && inGuessPhase) return $_('makeGuess');
			if (lobby.myRole === 'spymaster' && !inGuessPhase) return $_('givingClue');
			if (lobby.myRole === 'operative' && !inGuessPhase) return $_('waitingForClue');
		}
		return $_(`messageStatusOpponentTeam.${inGuessPhase ? 'operative' : 'spymaster'}`);
	}
</script>

<div class="mt-2 flex h-8 select-none items-center justify-center sm:mt-4 sm:h-12">
	{#if lobby.isConnectingToLobby}
		<div class="rounded bg-white p-1 text-center text-base sm:p-2 sm:text-2xl">
			<span class="mr-2 text-xl">{'Joining Lobby'}</span>
			<LoadingDots size="sm" />
		</div>
	{:else}
		{#key message}
			<div
				class="rounded bg-white p-1 text-center text-base sm:p-2 sm:text-2xl"
				in:typewriter={{ speed: 4 }}
			>
				{message}
			</div>
		{/key}
	{/if}
</div>
