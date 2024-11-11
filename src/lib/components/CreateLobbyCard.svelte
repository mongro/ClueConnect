<script lang="ts">
	import Button from './button/button.svelte';
	import Input from './Input.svelte';
	import { LocalStorageHelper } from './LocalStorageHelper';
	import { goto } from '$app/navigation';

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

<Input bind:value={name} />
<Button onclick={() => createLobby(name)}>Create Lobby</Button>
