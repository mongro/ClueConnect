import type { Action } from 'svelte/action';

export const clickOutside: Action<
	HTMLElement,
	undefined,
	{ onclick_outside: (e: CustomEvent) => void }
> = (node) => {
	const handleClick = (event: MouseEvent) => {
		if (!event.target) {
			return;
		}
		if (node && !node.contains(event.target as HTMLElement) && !event.defaultPrevented) {
			node.dispatchEvent(new CustomEvent('click_outside'));
		}
	};

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
};
