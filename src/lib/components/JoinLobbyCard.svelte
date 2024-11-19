<script lang="ts">
	import Button from './button/button.svelte';

	import Input from './input/Input.svelte';

	import { joinLobby } from '$lib/api';

	let name = $state('');
	let { lobbyId }: { lobbyId: string } = $props();
</script>

<div class="item-center mt-4 flex justify-center">
	<div class="w-full max-w-96 rounded bg-white p-4 shadow">
		<h1 class="mb-4 text-xl font-bold">Welcome to Clue Connect!</h1>
		<Input bind:value={name} class="mb-2 w-full" />
		<Button onclick={() => joinLobby(name, lobbyId)}>Join Lobby</Button>
	</div>
</div>
