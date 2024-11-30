<script lang="ts">
	import { Select, type Selected } from 'bits-ui';
	import { _, locale, locales } from 'svelte-i18n';
	import { browser } from '$app/environment';
	import { languages } from '$lib/i18n';

	const currLocale = $locale ? $locale.split('-')[0] : 'en';
	const currentLanguage = languages.find((item) => item.value == currLocale) ?? languages[0];
	let selectedLocale = $state<Selected<string>>(currentLanguage);

	function setLocale(localeNew: string) {
		if (browser) {
			locale.set(localeNew);
			const currentDate = new Date();
			const farFutureDate = new Date(currentDate.getTime() + 100 * 365 * 24 * 60 * 60 * 1000); // 100 years from now
			const expires = farFutureDate.toUTCString();
			document.cookie = `lang=${localeNew};expires=${expires}; path=/`;
		}
	}
</script>

<Select.Root
	portal={null}
	items={[
		{ value: 'en', label: 'En' },
		{ value: 'de', label: 'De' }
	]}
	selected={selectedLocale}
	onSelectedChange={(selected) => {
		if (selected) {
			setLocale(selected.value);
			selectedLocale = selected;
		}
	}}
>
	<Select.Trigger
		class="rounded-9px border-border-input placeholder:text-foreground-alt/50 inline-flex h-10 w-12 items-center border bg-background px-[11px] text-sm transition-colors  focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background"
	>
		<Select.Value class="uppercase" placeholder="Select a language" />
	</Select.Trigger>
	<Select.Content
		class="absolute z-50 rounded-xl border border-muted bg-background px-3 py-3 shadow-popover outline-none"
		sameWidth={false}
	>
		{#each languages as language}
			<Select.Item
				class="rounded-button flex h-10 w-full select-none items-center justify-center px-2  py-3 text-sm outline-none transition-all duration-75 data-[highlighted]:bg-muted"
				value={language.value}
				label={language.label}>{language.label}</Select.Item
			>
		{/each}
	</Select.Content>
	<Select.Input name="language" />
</Select.Root>
