<script lang="ts">
	import Button from './button/button.svelte';
	import { LocalStorageHelper } from './LocalStorageHelper';
	import { goto } from '$app/navigation';
	import Input from './input/Input.svelte';

	let name = $state('');
	async function createLobby(name: string) {
		try {
			const myHeaders = new Headers();
			myHeaders.append('Content-Type', 'application/json');

			const res = await fetch('http://localhost:5000/createLobby', {
				method: 'POST',
				body: JSON.stringify({ name }),
				headers: myHeaders
			});
			if (!res.ok) {
				throw new Error(`Response status: ${res.status}`);
			}

			const response = await res.json();
			LocalStorageHelper.setLobbyEntry(response.lobbyId, response.credentials);
			goto('/game/' + response.lobbyId);
		} catch (error) {
			console.error(error);
		}
	}
</script>

<div class="item-center mt-4 flex justify-center">
	<div class="w-full max-w-96 rounded bg-white p-4 shadow">
		<h1 class="mb-4 text-xl font-bold">Welcome to Clue Connect!</h1>
		<Input bind:value={name} class="mb-2 w-full" />
		<Button onclick={() => createLobby(name)}>Create Lobby</Button>
	</div>
</div>
