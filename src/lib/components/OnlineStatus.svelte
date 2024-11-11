<script lang="ts">
	interface Props {
		online: boolean;
	}
	let { online }: Props = $props();
</script>

<span
	class="mr-1 inline-block h-2 w-2 rounded-full"
	class:bg-green-500={online}
	class:bg-neutral-100={!online}
></span>
