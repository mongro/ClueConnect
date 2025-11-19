<script lang="ts">
	import Button from './button/button.svelte';
	import Input from './input/Input.svelte';
	import { createLobby } from '$lib/api';
	import { _ } from 'svelte-i18n';
	import { LoaderCircle } from 'lucide-svelte';
	import Delayed from './Delayed.svelte';

	let name = $state('');
	let error = $state('');
	let loading = $state(false);

	async function handleClick() {
		if (name == '') {
			error = 'You must enter a name.';
			return;
		}
		loading = true;
		await createLobby(name);
		loading = false;
	}
</script>

<div class="item-center mt-4 flex justify-center">
	<div class="w-full max-w-96 rounded bg-white p-4 shadow">
		<h1 class="mb-4 text-xl font-bold">{$_('welcome')}</h1>
		<Input bind:value={name} class="mb-2 w-full" type="text" />
		{#if error}
			<div class="text-destructive">{error}</div>
		{/if}

		<Button onclick={handleClick}>
			{#if loading}
				<Delayed delay={200}>
					<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
				</Delayed>
			{/if}
			{$_('createLobby')}</Button
		>
	</div>
</div>
