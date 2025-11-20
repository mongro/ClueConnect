<script lang="ts">
	import { flyAndScale } from '$lib/util';
	import { Select as SelectPrimitive, type WithoutChildrenOrChild } from 'bits-ui';
	import type { Snippet } from 'svelte';

	let {
		ref = $bindable(null),
		children,
		class: className,
		...restProps
	}: WithoutChildrenOrChild<SelectPrimitive.ContentProps> & {
		children?: Snippet;
	} = $props();
</script>

<SelectPrimitive.Portal>
	<SelectPrimitive.Content
		forceMount={true}
		class={' focus-override bg-popover text-popover-foreground relative z-50 min-w-32 overflow-hidden rounded-md border px-3 py-3 shadow-md outline-none ' +
			className}
		{...restProps}
	>
		{#snippet child({ wrapperProps, props, open })}
			{#if open}
				<div {...wrapperProps}>
					<div {...props} transition:flyAndScale>
						<SelectPrimitive.Viewport>
							{@render children?.()}
						</SelectPrimitive.Viewport>
					</div>
				</div>
			{/if}
		{/snippet}
	</SelectPrimitive.Content>
</SelectPrimitive.Portal>
