<script lang="ts">
	import socket from '$lib/socket';
	import type { GameState } from '$shared/src/types';
	import Button from './button/button.svelte';
	import CopyToClipboard from './CopyToClipboard.svelte';

	interface Props {
		gameState: GameState;
	}

	let { gameState }: Props = $props();
	function restart() {
		socket.emit('resetGame');
	}
	function resetTeams() {
		socket.emit('resetTeams');
	}
</script>

<div class="flex items-center gap-2">
	<Button onclick={restart}>Reset Game</Button>
	<Button onclick={resetTeams}>Reset Teams</Button>
	<CopyToClipboard />
</div>
