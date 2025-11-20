<script lang="ts">
	import type { Player, Role } from '$shared/src/types';
	import type { Snippet } from 'svelte';
	import { _ } from 'svelte-i18n';
	import OnlineStatus from '../OnlineStatus.svelte';
	interface Props {
		player: Player;
		myState?: Player | undefined;
		rightSide?: Snippet<[Player, Player | undefined]>;
	}

	let { player, myState, rightSide }: Props = $props();
</script>

<div
	class="bg-background text-foreground mb-1 flex items-center justify-between rounded p-2 text-base lg:text-lg"
>
	<div class="flex items-center">
		<OnlineStatus online={player.isConnected} />
		<span>{player.name}</span>
		{#if player.isHost}
			<span class="ml-2 text-xs">{`-${$_('host')}-`}</span>
		{/if}
	</div>
	{#if rightSide}
		{@render rightSide(player, myState)}
	{/if}
</div>
