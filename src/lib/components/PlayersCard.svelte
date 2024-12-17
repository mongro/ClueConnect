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
</script>

<div
	use:clickOutside
	onclick_outside={close}
	transition:fly={{ y: -20 }}
	class="absolute top-10 z-50 min-h-40 min-w-80 rounded bg-white p-4 text-secondary shadow-md"
>
	<div class="hidden flex-col items-center rounded bg-secondary p-2 text-primary sm:flex">
		<span class="mr-2">{$_('copyToClipboard')}</span>
		<CopyToClipboard />
	</div>
	<h2 class="mb-2 text-xl text-primary">{$_('playersLobby')}</h2>
	{#each getLobbyState().players as player}
		<Player {player} myState={getLobbyState().myState}>
			{#snippet rightSide(player: PlayerType, myState: PlayerType | null)}
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
</div>
