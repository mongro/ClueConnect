<script lang="ts">
	import { inputVariants, type InputProps } from './variants.js';

	let { value = $bindable(), class: className, textSize, ...props }: InputProps = $props();
</script>

<input {...props} bind:value class={inputVariants({ textSize, className })} />
