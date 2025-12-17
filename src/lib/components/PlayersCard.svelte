<script lang="ts">
	import { getLobbyState } from '$lib/lobby.svelte';
	import { type Player as PlayerType } from '$shared/src/types';
	import { Search, Binary, Binoculars } from 'lucide-svelte';
	import { _ } from 'svelte-i18n';
	import { fly } from 'svelte/transition';
	import Player from './team/Player.svelte';
	import { teamVariants } from './generalVariants';
	import { clickOutside } from '$lib/actions/clickOutside';
	import Button from './button/button.svelte';
	import socket from '$lib/socket';
	import CopyToClipboard from './CopyToClipboard.svelte';

	let { close }: { close: () => void } = $props();

	function kickPlayer(id: number) {
		socket.emit('kickPlayer', id);
	}

	function makeHost(id: number) {
		socket.emit('makeHost', id);
	}

	function resetTeams() {
		socket.emit('resetTeams');
	}

	function restart() {
		socket.emit('resetGame');
	}
</script>

<div
	use:clickOutside
	onclick_outside={close}
	transition:fly={{ y: -20 }}
	class="bg-popover text-popover-foreground absolute top-10 z-50 min-h-40 min-w-80 rounded p-4 shadow-md"
>
	<div class="bg-secondary text-primary flex flex-col items-center gap-2 rounded">
		<span class="mr-2">{$_('copyToClipboard')}</span>
		<CopyToClipboard />
	</div>
	<h2 class="text-primary mb-2 text-xl">{$_('playersLobby')}</h2>
	{#each getLobbyState().players as player}
		<Player {player} myState={getLobbyState().myState}>
			{#snippet rightSide(player, myState)}
				{#if myState?.isHost && !player.isHost}
					<div class="flex items-center gap-1">
						<Button size="sm" onclick={() => kickPlayer(player.id)} variant="destructive"
							>Kick</Button
						>
						<Button size="sm" onclick={() => makeHost(player.id)} variant="secondary"
							>{$_('makeHost')}</Button
						>
					</div>
				{/if}
				<div>
					{#if player?.role === 'spymaster'}
						<Binary class={teamVariants({ team: player.team })} />
					{:else if player?.role === 'operative'}
						<Search class={teamVariants({ team: player.team })} />
					{:else}
						<Binoculars />
					{/if}
				</div>
			{/snippet}
		</Player>
	{/each}
	<div class="mt-4 flex items-center justify-end gap-2">
		<Button onclick={resetTeams}>{$_('resetTeams')}</Button>
		<Button onclick={restart}>{$_('resetGame')}</Button>
	</div>
</div>
