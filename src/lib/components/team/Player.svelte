<script lang="ts">
	import type { Player } from '$shared/src/types';
	import OnlineStatus from '../OnlineStatus.svelte';
	interface Props {
		player: Player;
	}

	let { player }: Props = $props();
</script>

<div class="mb-1 flex items-center rounded bg-primary p-2 text-lg">
	<OnlineStatus online={player.isConnected} />{player.name}
</div>
