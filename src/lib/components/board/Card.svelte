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
		delay?: number;
	}

	let { children, type, word, button, revealed, spymaster, onclick, delay }: Props = $props();

	function deal(node: Element, { duration = 200, delay = 1 }) {
		const rect = node.getBoundingClientRect();
		const viewportCenterX = window.innerWidth / 2;
		const elementCenterX = rect.left + rect.width / 2;
		console.log('diff', elementCenterX - viewportCenterX, rect.left);
		const deg = Math.random() * 30;
		const dir = Math.random() < 0.5 ? 1 : -1;
		return {
			duration,
			delay,
			css: (t: number) =>
				`transform: rotate(${dir * deg * t}deg) translate(${(viewportCenterX - elementCenterX) * (1 - t)}px,${-rect.top * (1 - t)}px)`
		};
	}
</script>

<div
	class="p relative h-full w-full rounded text-base uppercase transition-transform duration-1000 perspective preserve3d sm:text-xl"
	class:flip-it={revealed}
	in:deal|global={{ duration: 400, delay: Math.random() * 1000 }}
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
