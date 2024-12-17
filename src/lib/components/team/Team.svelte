<script lang="ts">
	import type { Role, Team } from '$shared/src/types';
	import Button from '../button/button.svelte';
	import { teamTextVariants, teamContainerVariants } from './variants.js';
	import { _ } from 'svelte-i18n';
	import PlayerDisplay from './Player.svelte';
	import socket from '$lib/socket';
	import { getLobbyState } from '$lib/lobby.svelte';
	import Bot from './Bot.svelte';

	interface Props {
		score: number;
		team: Team;
	}

	let { score, team }: Props = $props();

	function joinRoleAndTeam(role: Role, team: Team) {
		socket.emit('joinTeamAndRole', team, role);
	}

	function addBot(role: Role, team: Team) {
		socket.emit('addBot', team, role);
	}
	function deleteBot(role: Role, team: Team) {
		socket.emit('deleteBot', team, role);
	}

	function showAddBotButton(role: Role, team: Team) {
		return !getLobbyState().hasMembers(team, role) && getLobbyState().myState?.isHost;
	}

	function showJoinSpyMasterButton() {
		return !getLobbyState().hasMembers(team, 'spymaster');
	}

	function showJoinOperativeButton() {
		return (
			!getLobbyState().hasBot(team, 'operative') &&
			!getLobbyState().myRoleIs(team, 'operative') &&
			!getLobbyState().hasSeenAllCardTypes()
		);
	}
</script>

<div class={teamContainerVariants({ team })}>
	<div class="flex items-center justify-center text-xl md:text-3xl lg:text-5xl">{score}</div>
	<div class={teamTextVariants({ team })}>{$_('agents')}</div>
	<div class="mt-1 flex-grow">
		{#each getLobbyState().getMembers(team, 'operative') as player}
			<PlayerDisplay {player} myState={getLobbyState().myState} />{/each}
		{#if getLobbyState().hasBot(team, 'operative')}
			<Bot deleteBot={() => deleteBot('operative', team)} />
		{/if}
		{#if showJoinOperativeButton()}
			<Button onclick={() => joinRoleAndTeam('operative', team)}>{$_('joinAgents')}</Button>
		{/if}
		{#if showAddBotButton('operative', team)}
			<Button onclick={() => addBot('operative', team)}>+Bot</Button>
		{/if}
	</div>
	<div class={teamTextVariants({ team })}>{$_('spymaster')}</div>
	<div class="mt-1 flex-grow">
		{#each getLobbyState().getMembers(team, 'spymaster') as player}
			<PlayerDisplay {player} myState={getLobbyState().myState} />{/each}
		{#if getLobbyState().hasBot(team, 'spymaster')}
			<Bot deleteBot={() => deleteBot('spymaster', team)} />
		{/if}
		{#if showJoinSpyMasterButton()}
			<Button onclick={() => joinRoleAndTeam('spymaster', team)}>{$_('becomeSpymaster')}</Button>
		{/if}
		{#if showAddBotButton('spymaster', team)}
			<Button onclick={() => addBot('spymaster', team)}>+Bot</Button>
		{/if}
	</div>
</div>
