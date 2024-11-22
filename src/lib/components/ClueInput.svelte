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
</script>

<div class="inline-flex items-center justify-center space-x-2">
	<Input placeholder="Give your clue here.." class=" max-w-48" bind:value={word} />
	<Input bind:value={number} class="max-w-28" type="number" min="1" step="1" />
	<Button onclick={(event) => sendClue(word, number)} size="lg">{$_('giveClueButton')}</Button>
</div>
