import { cva, type VariantProps } from 'class-variance-authority';
export const teamTextVariants = cva('text-sm', {
	variants: {
		team: {
			red: 'text-red-text',
			blue: 'text-blue-text'
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
export type TeamProps = VariantProps<typeof teamTextVariants>;