<script lang="ts">
	import socket from '$lib/socket';
	import Button from './button/button.svelte';
	import { _, locale } from 'svelte-i18n';
	import { Select, SelectTrigger } from './select';
	import SelectContent from './select/select-content.svelte';
	import SelectItem from './select/select-item.svelte';
	import { Checkbox, Label } from 'bits-ui';
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
	let selectedAppearance = $state<AppearanceCustomWords>('notFixed');
	let customWords = $derived(createWords());

	let selectedLanguage = $state<GameLanguage>(currentLanguage.value);

	let selectedLabelAppearance = $derived(
		selectedAppearance === 'notFixed'
			? $_('labelAppearanceNotFixed')
			: $_('labelAppearanceFixed', {
					values: {
						min: APPEARANCE[selectedAppearance][0],
						max: APPEARANCE[selectedAppearance][1]
					}
				})
	);
	let selectedLabelLanguage = $derived(
		languagesGame.find((item) => item.value == selectedLanguage)?.label ?? languagesGame[0].label
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
	<div class="bg-card color-card-foreground w-80 rounded p-4 lg:w-96">
		<h1 class="my-4 text-2xl font-bold">{$_('settings')}</h1>
		<h2 class="my-2 text-xl font-semibold">{$_('languageWords')}</h2>
		<Select
			items={[
				{ value: 'en', label: 'En' },
				{ value: 'de', label: 'De' }
			]}
			bind:value={selectedLanguage}
			type="single"
		>
			<SelectTrigger>{selectedLabelLanguage}</SelectTrigger>
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
				class="peer border-primary ring-offset-background focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground box-content h-4 w-4 shrink-0 rounded-sm border focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50"
				checked={customWordsEnabled}
				onCheckedChange={(checked: boolean | 'indeterminate') => {
					customWordsEnabled = checked === 'indeterminate' ? false : checked;
				}}
			>
				{#snippet children({ checked, indeterminate })}
					{#if checked}
						<div class="flex h-4 w-4 items-center justify-center text-current">
							<Check class="size-[15px]" />
						</div>
					{/if}
				{/snippet}
			</Checkbox.Root>
			<Label.Root
				id="customWordsEnabledLabel"
				for="customWordsEnabled"
				class="my-2 text-xl font-semibold"
			>
				{$_('customWords')}
			</Label.Root>
		</div>
		<div class="flex flex-col gap-4">
			{#if customWordsEnabled}
				<p>{$_('customWordsExplanation')}</p>

				<CustomWordsInput bind:value={customWordsInput} />
				<div>
					<p>{$_('wordsBasisCount')}1000</p>
					<p>{$_('wordsCount') + customWords.length}</p>
				</div>
				<Select bind:value={selectedAppearance} type="single">
					<SelectTrigger>{selectedLabelAppearance}</SelectTrigger>
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
			{/if}
			<Button
				variant="secondary"
				onclick={() =>
					startGame({
						language: selectedLanguage,
						customWords,
						appearanceCustomWords: selectedAppearance
					})}
			>
				{$_('startGame')}
			</Button>
		</div>
	</div>
</div>
