<script lang="ts">
	import type { Player, Role, Team, TeamComposition } from '$shared/src/types';
	import Button from '../button/button.svelte';
	import { teamTextVariants, teamContainerVariants } from './variants.js';

	import PlayerDisplay from './Player.svelte';
	import socket from '$lib/socket';
	import { lobby } from '$lib/players.svelte';

	interface Props {
		score: number;
		team: Team;
	}

	let { score, team }: Props = $props();

	function joinRoleAndTeam(role: Role, team: Team) {
		socket.emit('joinTeamAndRole', team, role);
	}
</script>

<div class={teamContainerVariants({ team })}>
	<div class="flex items-center justify-center text-xl md:text-3xl lg:text-5xl">{score}</div>
	<div class={teamTextVariants({ team })}>Operatives</div>
	<div class="mt-1 flex-grow">
		{#each lobby.getMembers(team, 'operative') as player}
			<PlayerDisplay {player} myState={lobby.myState} />{/each}
		{#if !lobby.myTeam}
			<Button onclick={() => joinRoleAndTeam('operative', team)}>Join Operatives</Button>
		{/if}
	</div>
	<div class={teamTextVariants({ team })}>Spymasters</div>
	<div class="mt-1 flex-grow">
		{#each lobby.getMembers(team, 'spymaster') as player}
			<PlayerDisplay {player} myState={lobby.myState} />{/each}
		{#if !lobby.myTeam}
			<Button onclick={() => joinRoleAndTeam('spymaster', team)}>Join Spymasters</Button>
		{/if}
	</div>
</div>
