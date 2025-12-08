<script lang="ts">
	import { Dialog as DialogPrimitive, type WithoutChildrenOrChild } from 'bits-ui';
	import X from 'lucide-svelte/icons/x';
	import * as Dialog from './index.js';
	import { flyAndScale } from '$lib/util.js';
	import type { Snippet } from 'svelte';

	let {
		ref = $bindable(null),
		children,
		class: className,
		...restProps
	}: WithoutChildrenOrChild<DialogPrimitive.ContentProps> & {
		children?: Snippet;
	} = $props();
</script>

<Dialog.Portal>
	<Dialog.Overlay />
	<DialogPrimitive.Content
		class={'bg-background fixed top-[50%] left-[50%] z-50 grid  max-h-[90%] w-full translate-x-[-50%] translate-y-[-50%] gap-4 overflow-y-auto border p-6 shadow-lg sm:rounded-lg ' +
			className}
		forceMount={true}
		{...restProps}
	>
		{#snippet child({ props, open })}
			{#if open}
				<div {...props} transition:flyAndScale>
					{@render children?.()}
				</div>
			{/if}
		{/snippet}
		{@render children?.()}
		<DialogPrimitive.Close
			class="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none"
		>
			<X class="h-4 w-4" />
			<span class="sr-only">Close</span>
		</DialogPrimitive.Close>
	</DialogPrimitive.Content>
</Dialog.Portal>
