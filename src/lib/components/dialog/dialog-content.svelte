<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import X from 'lucide-svelte/icons/x';
	import * as Dialog from './index.js';
	import { flyAndScale } from '$lib/util.js';

	let {
		transition = flyAndScale,
		transitionConfig = { duration: 200 },
		class: className,
		children,
		...restProps
	}: DialogPrimitive.OverlayProps = $props();
</script>

<Dialog.Portal>
	<Dialog.Overlay />
	<DialogPrimitive.Content
		{transition}
		{transitionConfig}
		class={'fixed left-[50%] top-[50%] z-50 grid max-h-[90%]  translate-x-[-50%] translate-y-[-50%] gap-4 overflow-y-auto border bg-background p-6 shadow-lg sm:rounded-lg ' +
			className}
		{...restProps}
	>
		{@render children?.()}
		<DialogPrimitive.Close
			class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
		>
			<X class="h-4 w-4" />
			<span class="sr-only">Close</span>
		</DialogPrimitive.Close>
	</DialogPrimitive.Content>
</Dialog.Portal>
