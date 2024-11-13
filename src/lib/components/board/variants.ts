import { cva, type VariantProps } from 'class-variance-authority';
export const suggestionVariants = cva('rounded p-1 text-white mr-1', {
	variants: {
		team: {
			red: 'bg-red-card',
			blue: 'bg-blue-card'
		}
	}
});
export const teamContainerVariants = cva('w-full rounded p-2 text-white shadow-2xl', {
	variants: {
		team: {
			red: 'bg-red-team',
			blue: 'bg-blue-team'
		}
	}
});
export type SuggestionProps = VariantProps<typeof suggestionVariants>;
