<script lang="ts">
	interface Props {
		handleJoin: (name: string) => void;
	}
	let { handleJoin }: Props = $props();
	let name = $state('');
</script>

<input bind:value={name} />
<button onclick={(event) => handleJoin(name)}>Join Lobby</button>
