<script lang="ts">
	import Button from './button/button.svelte';
	import Input from './Input.svelte';

	interface Props {
		sendClue: (word: string, number: number) => void;
	}
	let { sendClue }: Props = $props();
	let word = $state('');
	let number = $state(0);
</script>

<div class="inline-flex items-center justify-center space-x-2">
	<div class="w-32 px-2">
		<Input placeholder="Give your clue here.." class=" max-w-8" bind:value={word} />
	</div>
	<div class="w-24 px-2">
		<Input bind:value={number} class="max-w-2" type="number" min="1" step="1" />
	</div>
	<Button onclick={(event) => sendClue(word, number)} size="lg">Send</Button>
</div>
