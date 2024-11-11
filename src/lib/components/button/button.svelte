<script lang="ts">
	import { buttonVariants, type ButtonProps } from './variants.js';

	let { children, size, class: className, variant, ...props }: ButtonProps = $props();
</script>

<button class={buttonVariants({ variant, size, className })} type="button" {...props}>
	{@render children?.()}
</button>
