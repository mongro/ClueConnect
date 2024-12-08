<script lang="ts">
	interface Props {
		size: 'sm';
	}

	import { cva, type VariantProps } from 'class-variance-authority';
	export const loadingVariants = cva('h-2 w-2 animate-bounce rounded-full bg-black ', {
		variants: {
			size: {
				sm: 'h-2 w-2',
				md: 'h-4 w-4',
				lg: 'h-6 w-6'
			}
		}
	});

	let { size }: VariantProps<typeof loadingVariants> = $props();
</script>

<div class="inline-flex items-center space-x-1">
	<div class={loadingVariants({ size, className: '[animation-delay:-0.3s]' })}></div>
	<div class={loadingVariants({ size, className: '[animation-delay:-0.15s]' })}></div>
	<div class={loadingVariants({ size, className: '[animation-delay:-0.15s]' })}></div>
</div>
