<script>
	import * as Dialog from './dialog/index';
	import { buttonVariants } from './button/variants';
	import { _ } from 'svelte-i18n';

	let dialogOpen = $state(false);
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Trigger
		class={buttonVariants({ variant: 'outline' })}
		on:click={() => (dialogOpen = true)}>Rules</Dialog.Trigger
	>
	<Dialog.Portal>
		<Dialog.Overlay />
		<Dialog.Content>
			<Dialog.Title>{$_('rules')}</Dialog.Title>
			<Dialog.Close />
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
					Spymasters must avoid giving clues that lead teammates to guess codenames of the opposing
					team or the assassin. Non-verbal or additional hints are strictly prohibited.
				</p>

				<h2 class="mt-5 text-xl font-bold">{$_('guessing')}</h2>
				<p class="mt-2">
					Field Operatives discuss the clue and guess codenames by pointing to cards on the grid.
					Rules for guessing:
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
	</Dialog.Portal>
</Dialog.Root>
