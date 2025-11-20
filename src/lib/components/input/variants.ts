import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLInputAttributes } from 'svelte/elements';

export const inputVariants = cva(
	'"flex h-10 bg-input rounded-md border ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"',
	{
		variants: {
			textSize: {
				small: 'px-3 py-2 text-sm',
				medium: 'px-4 py-2 text-xl',
				large: 'px-4 py-2 text-xl md:px-6 md:py-4 md:text-3xl '
			}
		},
		defaultVariants: {
			textSize: 'small'
		}
	}
);

export type InputProps = HTMLInputAttributes & VariantProps<typeof inputVariants>;
