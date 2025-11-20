<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui';

	let { class: className, ...restProps }: DialogPrimitive.OverlayProps = $props();
</script>

<DialogPrimitive.Overlay
	class={'bg-background/80 fixed inset-0 z-50 backdrop-blur-sm ' + className}
	{...restProps}
/>
