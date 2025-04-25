import { getContext, hasContext, setContext } from 'svelte';

export class ModalManager {
	isOpen = $state<boolean>(false);
	title = $state<string>('');
	text = $state<string>('');

	constructor() {
		this.isOpen = false;
		this.text = '';
		this.title = '';
	}

	open(title: string, text: string) {
		console.log('openModal');
		this.isOpen = true;
		this.text = text;
		this.title = title;
	}
	close() {
		this.isOpen = false;
		this.text = '';
		this.title = '';
	}
}

const KEY = 'modal';

export function setModalState() {
	return setContext(KEY, new ModalManager());
}

export function getModalState() {
	if (hasContext(KEY)) {
		return getContext<ReturnType<typeof setModalState>>(KEY);
	} else throw 'Context not found.';
}
