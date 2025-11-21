<script lang="ts">
	import Button from './button/button.svelte';
	import Input from './input/Input.svelte';
	import { _ } from 'svelte-i18n';

	interface Props {
		sendClue: (word: string, number: number) => void;
	}
	let { sendClue }: Props = $props();
	let word = $state('');
	let number = $state(0);

	const validInput = $derived(word.length > 0 && Number.isInteger(number));
	const handleClick = () => {
		if (validInput) {
			sendClue(word, number);
		}
	};
</script>

<div
	class="inline-flex w-full items-center justify-center space-x-2 rounded-sm bg-gradient-to-r from-slate-900 to-slate-700 p-4 text-white"
>
	<Input
		type="text"
		textSize="large"
		placeholder="Give your clue here.."
		class="text min-w-32 grow uppercase"
		bind:value={word}
	/>
	<Input bind:value={number} class="max-w-14" type="number" min="1" max="9" step="1" />
	<Button disabled={!validInput} onclick={handleClick} size="lg" variant="secondary"
		>{$_('giveClueButton')}</Button
	>
</div>
