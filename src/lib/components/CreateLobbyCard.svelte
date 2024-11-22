<script lang="ts">
	import Button from './button/button.svelte';
	import Input from './input/Input.svelte';
	import { createLobby } from '$lib/api';
	import { _ } from 'svelte-i18n';

	let name = $state('');
</script>

<div class="item-center mt-4 flex justify-center">
	<div class="w-full max-w-96 rounded bg-white p-4 shadow">
		<h1 class="mb-4 text-xl font-bold">{$_('welcome')}</h1>
		<Input bind:value={name} class="mb-2 w-full" />
		<Button onclick={() => createLobby(name)}>{$_('createLobby')}</Button>
	</div>
</div>
