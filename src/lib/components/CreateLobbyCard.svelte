<script lang="ts">
	import Button from './button/button.svelte';
	import Input from './input/Input.svelte';
	import { createLobby } from '$lib/api';
	import { _ } from 'svelte-i18n';
	import { LoaderCircle } from 'lucide-svelte';
	import Delayed from './Delayed.svelte';
	import { Label } from 'bits-ui';

	let name = $state('');
	let error = $state('');
	let loading = $state(false);

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
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
	<div class="bg-card w-full max-w-96 rounded p-4 shadow">
		<h1 class="mb-4 text-xl font-bold">{$_('welcome')}</h1>
		<form onsubmit={handleSubmit}>
			<div class="flex flex-col gap-4">
				<Label.Root
					for="nickname"
					class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					Enter your Nickname
				</Label.Root>
				<Input bind:value={name} class="mb-2 w-full" type="text" id="nickname" name="nickname" />
				{#if error}
					<div class="text-destructive">{error}</div>
				{/if}

				<Button type="submit">
					{#if loading}
						<Delayed delay={200}>
							<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
						</Delayed>
					{/if}
					{$_('createLobby')}</Button
				>
			</div>
		</form>
	</div>
</div>
