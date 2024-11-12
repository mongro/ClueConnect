<script lang="ts" generics="T">
	import type { CardType } from '$shared/src/types';
	import type { Snippet } from 'svelte';
	import socket from '$lib/socket';

	interface Props {
		type: CardType;
		word: string;
		revealed: boolean;
		button: Snippet;
		children: Snippet<[]>;
		spymaster: boolean;
		onclick: () => void;
	}

	let { children, type, word, button, revealed, spymaster, onclick }: Props = $props();
</script>

<div
	class="p relative h-full w-full rounded text-xl uppercase transition-transform duration-1000 perspective preserve3d"
	class:flip-it={revealed}
>
	<div
		class="absolute h-full w-full backface-hidden"
		class:bg-red-card={type === 'red' && spymaster}
		class:bg-blue-card={type === 'blue' && spymaster}
		class:bg-neutral-900={type === 'black' && spymaster}
		class:bg-neutral-300={type === 'grey' || !spymaster}
	>
		<div
			role="button"
			class=" absolute bottom-4 flex w-full items-center justify-center bg-white text-center"
			{onclick}
			tabindex="0"
			onkeydown={onclick}
		>
			{word}
		</div>
		{@render button()}
		{@render children()}
	</div>
	<div
		class="flip-it absolute h-full w-full backface-hidden"
		class:bg-red-card={type === 'red'}
		class:bg-blue-card={type === 'blue'}
		class:bg-neutral-900={type === 'black'}
		class:bg-neutral-300={type === 'grey'}
	></div>
</div>

<style>
	.flip-it {
		transform: rotateY(180deg);
	}
</style>
