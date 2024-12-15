<script lang="ts">
	import type { GameAction } from '$shared/src/types';
	import { cva } from 'class-variance-authority';
	import { _ } from 'svelte-i18n';

	interface Props {
		message: GameAction;
	}

	let { message }: Props = $props();

	const wordVariants = cva('p-1 text-lg uppercase', {
		variants: {
			cardType: {
				red: 'text-red-card',
				blue: 'text-blue-card',
				grey: 'text-neutral-500 ',
				black: 'text-neutral-950 '
			}
		}
	});
</script>

<div class="flex">
	{#if message.type === 'guess'}
		<p class="bg-white">
			<span
				class="p-1 text-lg font-bold"
				class:text-red-500={message.team === 'red'}
				class:text-blue-500={message.team === 'blue'}>{message.player}</span
			>
			{$_('logGuess')}
			<span class={wordVariants({ cardType: message.cardType })}>{message.word}</span>
		</p>
	{:else if message.type === 'clue'}
		<p class="bg-white">
			<span
				class="p-1 text-lg font-bold"
				class:text-red-500={message.team === 'red'}
				class:text-blue-500={message.team === 'blue'}>{message.player}</span
			>
			{$_('logClue')}
			<span class=" p-1 text-lg uppercase">{message.clue.clue}</span>
			<span class=" p-1 text-lg uppercase">{message.clue.number}</span>
		</p>
	{/if}
</div>
