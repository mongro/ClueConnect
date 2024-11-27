<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import { fade } from 'svelte/transition';

	let {
		transition = fade,
		transitionConfig = { duration: 150 },
		class: className,
		...restProps
	}: DialogPrimitive.OverlayProps = $props();
</script>

<DialogPrimitive.Overlay
	{transition}
	{transitionConfig}
	class={'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm ' + className}
	{...restProps}
/>
