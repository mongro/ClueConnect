<script lang="ts">
	import { browser } from '$app/environment';
	import Button from './button/button.svelte';
	import Input from './input/Input.svelte';
	import { Clipboard, Check, Ban } from 'lucide-svelte';

	let error: boolean = $state(false);
	let success: boolean = $state(false);
	let url = browser ? window.location.href : '';

	async function copyToClipboard() {
		if (!browser) return;
		try {
			await navigator.clipboard.writeText(url);
			success = true;
			setTimeout(() => {
				success = false;
			}, 2000);
		} catch (e) {
			error = true;
			setTimeout(() => {
				error = false;
			}, 2000);
		}
	}
</script>

<div class="flex items-center">
	<Input readonly value={url} />
	<Button size="icon" onclick={copyToClipboard} aria-label="copyToClipboard">
		{#if !error && !success}
			<Clipboard />
		{/if}
		{#if error}
			<Ban />
		{/if}
		{#if success}
			<Check />
		{/if}
	</Button>
</div>
