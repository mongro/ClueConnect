<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui';

	let { class: className, children, ...restProps }: DialogPrimitive.TitleProps = $props();
</script>

<DialogPrimitive.Title
	class={'text-lg font-semibold leading-none tracking-tight' + className}
	{...restProps}
>
	{@render children?.()}</DialogPrimitive.Title
>
