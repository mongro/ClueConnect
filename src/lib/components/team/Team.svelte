<script lang="ts">
	import type { Role, Team } from '$shared/src/types';
	import Button from '../button/button.svelte';
	import { teamTextVariants, teamContainerVariants } from './variants.js';
	import { _ } from 'svelte-i18n';
	import PlayerDisplay from './Player.svelte';
	import socket from '$lib/socket';
	import { getLobbyState } from '$lib/lobby.svelte';

	interface Props {
		score: number;
		team: Team;
	}

	let { score, team }: Props = $props();

	function joinRoleAndTeam(role: Role, team: Team) {
		socket.emit('joinTeamAndRole', team, role);
	}

	function showJoinSpyMasterButton() {
		return (
			!(getLobbyState().myRole == 'spymaster' && getLobbyState().myTeam == team) &&
			getLobbyState().getMembers(team, 'spymaster').length == 0
		);
	}

	function showJoinOperativeButton() {
		return (
			!(getLobbyState().myRole == 'operative' && getLobbyState().myTeam == team) &&
			(!(getLobbyState().myRole == 'spymaster') || !getLobbyState().hasStarted())
		);
	}
</script>

<div class={teamContainerVariants({ team })}>
	<div class="flex items-center justify-center text-xl md:text-3xl lg:text-5xl">{score}</div>
	<div class={teamTextVariants({ team })}>{$_('agents')}</div>
	<div class="mt-1 flex-grow">
		{#each getLobbyState().getMembers(team, 'operative') as player}
			<PlayerDisplay {player} myState={getLobbyState().myState} />{/each}
		{#if showJoinOperativeButton()}
			<Button onclick={() => joinRoleAndTeam('operative', team)}>{$_('joinAgents')}</Button>
		{/if}
	</div>
	<div class={teamTextVariants({ team })}>{$_('spymaster')}</div>
	<div class="mt-1 flex-grow">
		{#each getLobbyState().getMembers(team, 'spymaster') as player}
			<PlayerDisplay {player} myState={getLobbyState().myState} />{/each}
		{#if showJoinSpyMasterButton()}
			<Button onclick={() => joinRoleAndTeam('spymaster', team)}>{$_('becomeSpymaster')}</Button>
		{/if}
	</div>
</div>
