<script lang="ts">
	import { buttonVariants, type ButtonProps } from './variants.js';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	let { children, size, class: className, variant, ...props }: ButtonProps = $props();
</script>

<button class={buttonVariants({ variant, size, className })} type="button" {...props}>
	{@render children?.()}
</button>
