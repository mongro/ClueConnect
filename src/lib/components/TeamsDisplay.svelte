<script lang="ts">
	import type { Player, Role, Team, TeamComposition } from '$shared/src/types';
	import Button from './button/button.svelte';

	interface Props {
		score: { blue: number; red: number };
		joinRoleAndTeam: (role: Role, team: Team) => void;
		myState: Player;
		teams: TeamComposition;
	}

	let { score, joinRoleAndTeam, myState, teams }: Props = $props();
</script>

<div class="flex flex-col gap-4">
	<div class=" w-full rounded bg-red-team p-2 text-white shadow-2xl">
		<div class="flex items-center justify-center text-5xl">{score.red}</div>
		<div class="text-sm text-red-text">Operatives</div>
		{#each teams.red.operative as player}
			<div class="text-lg">{player.name}</div>{/each}
		{#if !myState.team}
			<Button onclick={() => joinRoleAndTeam('operative', 'red')}>Join Operatives</Button>
		{/if}
		<div class="text-sm text-red-text">Spymasters</div>
		{#each teams.red.spymaster as player}
			<div class="text-lg">{player.name}</div>{/each}
		{#if !myState.team}
			<Button onclick={() => joinRoleAndTeam('spymaster', 'red')}>Join Spymasters</Button>
		{/if}
	</div>
	<div class="bg-red-blue w-full rounded bg-blue-team p-2 text-white shadow-2xl">
		<div class="flex items-center justify-center text-5xl">{score.blue}</div>
		<div class="text-sm text-blue-text">Operatives</div>
		{#each teams.blue.operative as player}
			<div class="text-lg">{player.name}</div>{/each}
		{#if !myState.team}
			<Button onclick={() => joinRoleAndTeam('operative', 'blue')}>Join Operatives</Button>
		{/if}
		<div class="text-sm text-blue-text">Spymasters</div>
		{#if !myState.team}
			{#each teams.blue.spymaster as player}
				<div class="text-lg">{player.name}</div>{/each}
			<Button onclick={() => joinRoleAndTeam('spymaster', 'blue')}>Join Spymasters</Button>
		{/if}
	</div>
</div>
