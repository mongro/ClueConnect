<script lang="ts">
	import type { Player, Role, Team, TeamComposition } from '$shared/src/types';
	import Button from '../button/button.svelte';
	import PlayerDisplay from './Player.svelte';

	interface Props {
		score: number;
		joinRole: (role: Role) => void;
		myState: Player;
		spymaster: Player[];
		operative: Player[];
		team: Team;
	}

	let { score, joinRole, myState, operative, spymaster, team }: Props = $props();
</script>

<div
	class=" w-full rounded p-2 text-white shadow-2xl"
	class:bg-red-team={team === 'red'}
	class:bg-blue-team={team === 'blue'}
>
	<div class="flex items-center justify-center text-5xl">{score}</div>
	<div class="text-sm text-red-text">Operatives</div>
	{#each operative as player}
		<PlayerDisplay {player} />{/each}
	{#if !myState.team}
		<Button onclick={() => joinRole('operative')}>Join Operatives</Button>
	{/if}
	<div class="text-sm text-red-text">Spymasters</div>
	{#each spymaster as player}
		<PlayerDisplay {player} />{/each}
	{#if !myState.team}
		<Button onclick={() => joinRole('spymaster')}>Join Spymasters</Button>
	{/if}
</div>
