import { cva, type VariantProps } from 'class-variance-authority';
export const teamVariants = cva(undefined, {
	variants: {
		team: {
			red: 'text-red-card',
			blue: 'text-blue-card'
		}
	}
});
