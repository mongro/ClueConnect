// src/lib/i18n/index.ts
import { browser } from '$app/environment';
import type { GameLanguage } from '$shared/src/types';
import { init, register } from 'svelte-i18n';

const defaultLocale = 'en';

export const languages = [
	{ value: 'en', label: 'EN' },
	{ value: 'de', label: 'DE' }
];
export const languagesGame: { value: GameLanguage; label: string }[] = [
	{ value: 'en', label: 'English' },
	{ value: 'de', label: 'Deutsch' }
];

register('en', () => import('./locales/en.json'));
register('de', () => import('./locales/de.json'));

init({
	fallbackLocale: defaultLocale,
	initialLocale: browser ? window.navigator.language : defaultLocale
});
