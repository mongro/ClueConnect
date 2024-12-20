import { locale, waitLocale } from 'svelte-i18n';
import type { LayoutLoad } from './$types';
import { initLocale } from '$lib/i18n';

export const load: LayoutLoad = async ({ data }) => {
	console.log('universalLoad', data.lang);
	initLocale(data.lang);
	await waitLocale();
};
