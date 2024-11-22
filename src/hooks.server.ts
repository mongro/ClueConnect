import type { Handle } from '@sveltejs/kit';
import { locale } from 'svelte-i18n';

/* export const handle: Handle = async ({ event, resolve }) => {
	console.log('hook');
	let lang = event.request.headers.get('cookie');
	if (lang) {
		locale.set(lang);
		return resolve(event);
	}

	lang = event.request.headers.get('accept-language')?.split(',')[0] ?? null;

	return resolve(event);
}; */
