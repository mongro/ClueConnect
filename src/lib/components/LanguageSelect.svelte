<script lang="ts">
	import { Select, type Selected } from 'bits-ui';
	import { _, locale, locales } from 'svelte-i18n';
	import { browser } from '$app/environment';
	import { languages } from '$lib/i18n';
	import { SelectContent, SelectItem, SelectTrigger } from './select';

	const currLocale = $locale ? $locale.split('-')[0] : 'en';
	const currentLanguage = languages.find((item) => item.value == currLocale) ?? languages[0];
	let selectedLocale = $state<string>(currentLanguage.value);

	function setLocale(localeNew: string) {
		if (browser) {
			locale.set(localeNew);
			const currentDate = new Date();
			const farFutureDate = new Date(currentDate.getTime() + 100 * 365 * 24 * 60 * 60 * 1000); // 100 years from now
			const expires = farFutureDate.toUTCString();
			document.cookie = `lang=${localeNew};expires=${expires}; path=/`;
		}
	}

	const currentLabel = $derived(languages.find((item) => item.value === selectedLocale)?.label);
</script>

<Select.Root
	items={[
		{ value: 'en', label: 'En' },
		{ value: 'de', label: 'De' }
	]}
	type="single"
	value={selectedLocale}
	onValueChange={(selected) => {
		if (selected) {
			setLocale(selected);
			selectedLocale = selected;
		}
	}}
>
	<SelectTrigger>
		<div class="uppercase">
			{currentLabel}
		</div>
	</SelectTrigger>
	<SelectContent>
		{#each languages as language}
			<SelectItem value={language.value} label={language.label}>{language.label}</SelectItem>
		{/each}
	</SelectContent>
</Select.Root>
