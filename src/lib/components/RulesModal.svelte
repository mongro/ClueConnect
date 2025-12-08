<script>
	import * as Dialog from './dialog/index';
	import { buttonVariants } from './button/variants';
	import { X } from 'lucide-svelte';
	import { _ } from 'svelte-i18n';

	let dialogOpen = $state(false);
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline' })} onclick={() => (dialogOpen = true)}
		>{$_('rules')}</Dialog.Trigger
	>

	<Dialog.Content class="max-w-3xl" preventScroll={false}>
		<Dialog.Title>{$_('rules')}</Dialog.Title>
		<Dialog.Close
			class="focus-visible:ring-foreground focus-visible:ring-offset-background absolute top-5 right-5 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden active:scale-[0.98]"
		>
			<div>
				<X />
				<span class="sr-only">Close</span>
			</div>
		</Dialog.Close>
		<div class="*: container">
			<h2 class="mt-5 text-xl font-bold">{$_('overview')}</h2>
			<p class="mt-2">
				{$_('overviewText')}
			</p>

			<h2 class="mt-5 text-xl font-bold">{$_('gameplay')}</h2>
			<p class="mt-2">
				{$_('spymasterRoleText')}
			</p>
			<ul class="list-inside list-disc">
				{@html $_('clueRules')}
			</ul>
			<p class="mt-2">
				{$_('spymasterRoleText2')}
			</p>

			<h2 class="mt-5 text-xl font-bold">{$_('guessing')}</h2>
			<p class="mt-2">
				{$_('operativeRoleText')}
			</p>
			<ul class="list-inside list-disc">
				{@html $_('guessingRules')}
			</ul>

			<h2 class="mt-5 text-xl font-bold">{$_('strategy')}</h2>
			<p class="mt-2">
				{$_('strategyText')}
			</p>

			<h2 class="mt-5 text-xl font-bold">{$_('winning')}</h2>
			<p class="mt-2">
				{$_('winningText')}
			</p>
		</div>
	</Dialog.Content>
</Dialog.Root>
