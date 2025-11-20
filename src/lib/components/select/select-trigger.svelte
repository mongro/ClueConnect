<script lang="ts">
	import { Select as SelectPrimitive } from 'bits-ui';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import Button from '../button/button.svelte';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<SelectPrimitive.Trigger>
	{#snippet child({ props })}
		<Button {...props}>
			{@render children?.()}
			<div>
				<ChevronDown class="h-4 w-4 opacity-50" />
			</div>
		</Button>
	{/snippet}
</SelectPrimitive.Trigger>
