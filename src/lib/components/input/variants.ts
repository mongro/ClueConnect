import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLInputAttributes } from 'svelte/elements';

export const inputVariants = cva(
	'"flex h-10 rounded-md border border-input  text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"',
	{
		variants: {
			size: {
				small: 'px-3 py-2',
				large: 'px-5 py-3'
			}
		}
	}
);

export type InputProps = HTMLInputAttributes & VariantProps<typeof inputVariants>;
