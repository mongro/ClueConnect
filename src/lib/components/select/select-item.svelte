<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
	import { Select as SelectPrimitive, type WithoutChildrenOrChild } from 'bits-ui';
	import type { Snippet } from 'svelte';

	let {
		ref = $bindable(null),
		children,
		value,
		disabled,
		label,
		class: className,
		...restProps
	}: WithoutChildrenOrChild<SelectPrimitive.ItemProps> & {
		children?: Snippet;
	} = $props();
</script>

<SelectPrimitive.Item
	{value}
	{disabled}
	{label}
	class={'data-highlighted:bg-accent data-highlighted:text-accent-foreground relative flex w-full cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 ' +
		className}
	{...restProps}
>
	{#snippet children({ selected })}
		<span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
			{#if selected}
				<Check class="h-4 w-4" />
			{/if}
		</span>
		{label}
	{/snippet}
</SelectPrimitive.Item>
