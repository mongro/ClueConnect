<script lang="ts">
	import { getLobbyState } from '$lib/lobby.svelte';
	import Button from '../button/button.svelte';

	interface Props {
		deleteBot: () => void;
	}

	let { deleteBot }: Props = $props();
</script>

<div class="flex items-center justify-between">
	<div>BOT</div>
	{#if getLobbyState().myState?.isHost}
		<Button onclick={deleteBot}>delete</Button>
	{/if}
</div>
