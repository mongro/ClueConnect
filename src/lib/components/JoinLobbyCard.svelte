<script lang="ts">
	import Button from './button/button.svelte';
	import { LocalStorageHelper } from './LocalStorageHelper';
	import { goto } from '$app/navigation';
	import Input from './input/Input.svelte';
	import socket from '$lib/socket';

	let name = $state('');
	let { lobbyId }: { lobbyId: string } = $props();
	function syncWithLobby(id: string) {
		const credentials = LocalStorageHelper.getLobbyEntry(id);
		if (credentials) socket.emit('joinLobby', id, credentials);
	}

	async function join(name: string) {
		try {
			const myHeaders = new Headers();
			myHeaders.append('Content-Type', 'application/json');

			const res = await fetch('http://localhost:5000/joinLobby', {
				method: 'POST',
				body: JSON.stringify({ name, lobbyId }),
				headers: myHeaders
			});
			if (!res.ok) {
				throw new Error(`Response status: ${res.status}`);
			}

			const response = await res.json();
			LocalStorageHelper.setLobbyEntry(response.lobbyId, response.credentials);
			syncWithLobby(response.lobbyId);
		} catch (error) {
			console.error(error);
		}
	}
</script>

<div class="item-center mt-4 flex justify-center">
	<div class="w-full max-w-96 rounded bg-white p-4 shadow">
		<h1 class="mb-4 text-xl font-bold">Welcome to Clue Connect!</h1>
		<Input bind:value={name} class="mb-2" />
		<Button onclick={() => join(name)}>Join Lobby</Button>
	</div>
</div>
