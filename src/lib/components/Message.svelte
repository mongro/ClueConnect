<script lang="ts">
	import type { GameAction } from '$shared/src/types';
	import { _ } from 'svelte-i18n';

	interface Props {
		message: GameAction;
	}

	let { message }: Props = $props();
</script>

<div class="flex">
	{#if message.type === 'guess'}
		<p class:text-red-500={message.team === 'red'} class:text-blue-500={message.team === 'blue'}>
			<span class="bg-white p-1 text-lg font-bold">{message.player}</span>
			{$_('logGuess')}
			<span class="bg-white p-1 text-lg uppercase">{message.word}</span>
		</p>
	{:else if message.type === 'clue'}
		<p class:text-red-500={message.team === 'red'} class:text-blue-500={message.team === 'blue'}>
			<span class="bg-white p-1 text-lg font-bold">{message.player}</span>
			{$_('logClue')}
			<span class="bg-white p-1 text-lg uppercase">{message.clue.clue}</span>
			<span class="bg-white p-1 text-lg uppercase">{message.clue.number}</span>
		</p>
	{/if}
</div>
