<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<div class="relative h-screen">
	<div class="background absolute inset-0 bg-cover">
		{@render children()}
	</div>
</div>

<style>
	.background {
		background-image: url('$lib/images/pattern.svg');
	}
</style>
