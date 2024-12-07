<script lang="ts">
	import socket from '$lib/socket';
	import Button from './button/button.svelte';
	import { _, locale } from 'svelte-i18n';
	import { Select, SelectTrigger, SelectValue } from './select';
	import SelectContent from './select/select-content.svelte';
	import SelectItem from './select/select-item.svelte';
	import { Checkbox, Label, type Selected } from 'bits-ui';
	import type { AppearanceCustomWords, GameLanguage, GameOptions } from '$shared/src/types';
	import { languagesGame } from '$lib/i18n';
	import CustomWordsInput from './CustomWordsInput.svelte';
	import { getLobbyState } from '$lib/lobby.svelte';
	import { Check, Minus } from 'lucide-svelte';

	export const APPEARANCE = {
		low: [1, 3],
		middle: [4, 6],
		high: [7, 10]
	} as const;
	const gameState = getLobbyState().gameState;

	const currLocale = $locale ? $locale.split('-')[0] : 'en';
	const currentLanguage =
		languagesGame.find((item) => item.value == currLocale) ?? languagesGame[0];

	let customWordsInput = $state<string>(gameState?.options.customWords?.join(' ') ?? '');
	let customWordsEnabled = $state<boolean>(false);
	let selectedAppearance = $state<Selected<AppearanceCustomWords>>({
		value: 'notFixed',
		label: $_('labelAppearanceNotFixed')
	});
	let customWords = $derived(createWords());

	let selectedLanguage = $state<Selected<GameLanguage>>({
		value: currentLanguage.value,
		label: currentLanguage.label
	});

	let selectedLabel = $derived(
		selectedAppearance.value === 'notFixed'
			? $_('labelAppearanceNotFixed')
			: $_('labelAppearanceFixed', {
					values: {
						min: APPEARANCE[selectedAppearance.value][0],
						max: APPEARANCE[selectedAppearance.value][1]
					}
				})
	);
	function startGame(options: Partial<GameOptions> = {}) {
		socket.emit('startGame', options);
	}

	function createWords() {
		const input = customWordsInput.trim();
		// Split by spaces or newlines
		return input === '' ? [] : input.split(/\s+/);
	}
</script>

<div class="flex w-full justify-center">
	<div class="w-80 rounded bg-white p-4 lg:w-96">
		<h1 class="my-4 text-2xl font-bold">{$_('settings')}</h1>
		<h2 class="my-2 text-xl font-semibold">{$_('languageWords')}</h2>
		<Select
			selected={selectedLanguage}
			onSelectedChange={(selected) => {
				if (selected) {
					selectedLanguage = selected;
				}
			}}
		>
			<SelectTrigger><SelectValue>{selectedLabel}</SelectValue></SelectTrigger>
			<SelectContent>
				{#each languagesGame as language}
					<SelectItem value={language.value} label={language.label}>{language.label}</SelectItem>
				{/each}
			</SelectContent>
		</Select>
		<div class="flex items-center space-x-3">
			<Checkbox.Root
				id="customWordsEnabled"
				aria-labelledby="customWordsEnabled"
				class="active:scale-98 data-[state=unchecked]:border-border-input data-[state=unchecked]:hover:border-dark-40 peer inline-flex size-[25px] items-center justify-center rounded-md border border-muted bg-foreground transition-all duration-150 ease-in-out data-[state=unchecked]:bg-background"
				checked={customWordsEnabled}
				onCheckedChange={(checked: boolean | 'indeterminate') => {
					customWordsEnabled = checked === 'indeterminate' ? false : checked;
				}}
			>
				<Checkbox.Indicator
					let:isChecked
					class="inline-flex items-center justify-center text-background"
				>
					{#if isChecked}
						<Check class="size-[15px]" />
					{/if}
				</Checkbox.Indicator>
			</Checkbox.Root>
			<Label.Root
				id="customWordsEnabledLabel"
				for="customWordsEnabled"
				class="my-2 text-xl font-semibold"
			>
				{$_('customWords')}
			</Label.Root>
		</div>
		{#if customWordsEnabled}
			<div class="my-2">
				<p>{$_('customWordsExplanation')}</p>
			</div>
			<CustomWordsInput bind:value={customWordsInput} />
			<div class="my-2">
				<p>{$_('wordsBasisCount')}1000</p>
				<p>{$_('wordsCount') + customWords.length}</p>
				<Select
					selected={selectedAppearance}
					onSelectedChange={(selected) => {
						if (selected) {
							selectedAppearance = selected;
						}
					}}
				>
					<SelectTrigger>{selectedLabel}</SelectTrigger>
					<SelectContent>
						{#each Object.entries(APPEARANCE) as [appereance, range]}
							<SelectItem
								value={appereance}
								label={$_('labelAppearanceFixed', {
									values: { min: range[0], max: range[1] }
								})}
								>{$_('labelAppearanceFixed', {
									values: { min: range[0], max: range[1] }
								})}</SelectItem
							>
						{/each}
						<SelectItem value="notFixed" label={$_('labelAppearanceNotFixed')}
							>{$_('labelAppearanceNotFixed')}</SelectItem
						>
					</SelectContent>
				</Select>
			</div>
		{/if}

		<div class="flex items-center">
			<Button
				onclick={() =>
					startGame({
						language: selectedLanguage.value,
						customWords,
						appearanceCustomWords: selectedAppearance.value
					})}
			>
				{$_('startGame')}
			</Button>
		</div>
	</div>
</div>
