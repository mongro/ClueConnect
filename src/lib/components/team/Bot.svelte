<script lang="ts">
	import { getLobbyState } from '$lib/lobby.svelte';
	import Button from '../button/button.svelte';
	import LoadingDots from '../LoadingDots.svelte';

	interface Props {
		deleteBot: () => void;
		isThinking: boolean;
	}

	let { deleteBot, isThinking }: Props = $props();
</script>

<div class="flex items-center justify-between">
	<div class="">BOT</div>
	{#if isThinking}
		<LoadingDots></LoadingDots>
	{/if}
	{#if getLobbyState().myState?.isHost}
		<Button onclick={deleteBot}>delete</Button>
	{/if}
</div>
