<script lang="ts" generics="T">
	import Cardback from '$lib/svg/Cardback.svelte';
	import type { CardType } from '$shared/src/types';
	import type { Snippet } from 'svelte';

	interface Props {
		type: CardType;
		word: string;
		revealed: boolean;
		button: Snippet<[boolean, () => void]>;
		children: Snippet<[]>;
		onclick: () => void;
	}

	let { children, type, word, button, revealed, onclick }: Props = $props();

	let showCardbackAfterReveal = $state(true);

	function toggleShowCardbackAfterReveal() {
		showCardbackAfterReveal = !showCardbackAfterReveal;
	}

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

{#key word}
	<div
		class="p relative aspect-[16/9] h-full w-full rounded text-sm uppercase transition-transform duration-1000 perspective preserve3d sm:text-xl"
		class:flip-it={revealed && showCardbackAfterReveal}
		in:deal|global={{ duration: 400, delay: Math.random() * 1000 }}
	>
		<div class="absolute h-full w-full backface-hidden">
			{#if type === 'red'}
				<Cardback
					colors={['#fecaca', '#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c', '#991b1b']}
				/>
			{:else if type === 'blue'}
				<Cardback
					colors={['#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af']}
				/>
			{:else if type === 'grey'}
				<Cardback
					colors={['#f9fafb', '#f3f4f6', '#e5e7eb', '#fef3c7', '#fde68a', '#d1d5db', '#9ca3af']}
				/>
			{:else if type === 'black'}
				<Cardback
					colors={['#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280', '#4b5563', '#374151', '#1f2937']}
				/>
			{/if}
			<div
				role="button"
				class=" absolute bottom-1 flex w-full items-center justify-center bg-white text-center sm:bottom-4"
				{onclick}
				tabindex="0"
				onkeydown={onclick}
			>
				{word}
			</div>
			{@render button(revealed, toggleShowCardbackAfterReveal)}
			{@render children()}
		</div>
		<div class="flip-it absolute h-full w-full backface-hidden">
			{#if type === 'red'}
				<Cardback
					colors={['#fecaca', '#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c', '#991b1b']}
					back
				/>
			{:else if type === 'blue'}
				<Cardback
					colors={['#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af']}
					back
				/>
			{:else if type === 'grey'}
				<Cardback
					colors={['#f9fafb', '#f3f4f6', '#e5e7eb', '#fef3c7', '#fde68a', '#d1d5db', '#9ca3af']}
					back
				/>
			{:else if type === 'black'}
				<Cardback
					colors={['#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280', '#4b5563', '#374151', '#1f2937']}
					back
				/>
			{/if}
			{@render button(revealed, toggleShowCardbackAfterReveal)}
		</div>
	</div>
{/key}

<style>
	.flip-it {
		transform: rotateY(180deg);
	}
</style>
