<script lang="ts">
	import Button from './button/button.svelte';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import Input from './input/Input.svelte';

	import { joinLobby } from '$lib/api';
	import { LocalStorageHelper } from './LocalStorageHelper';
	import { getLobbyState } from '$lib/lobby.svelte';

	let name = $state('');
	let loading = $state(false);
	let { lobbyId }: { lobbyId: string } = $props();
	const lobby = getLobbyState();

	async function handleClick() {
		loading = true;
		const response = await joinLobby(name, lobbyId);
		loading = false;
		LocalStorageHelper.setLobbyEntry(response.lobbyId, response.credentials);
		lobby.credentials = response.credentials;
		lobby.connect();
	}
</script>

<div class="item-center mt-4 flex justify-center">
	<div class="w-full max-w-96 rounded bg-white p-4 shadow">
		<h1 class="mb-4 text-xl font-bold">Welcome to Clue Connect!</h1>
		<Input bind:value={name} class="mb-2 w-full" />
		<Button onclick={handleClick} disabled={loading}>
			{#if loading}
				<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
			{/if}
			Join Lobby</Button
		>
	</div>
</div>
