<script lang="ts">
	import * as Dialog from './dialog/index';
	import { _ } from 'svelte-i18n';

	interface Props {
		text: string;
		title: string;
		isOpen: boolean;
	}
	let { title, text, isOpen = $bindable() }: Props = $props();
</script>

<Dialog.Root bind:open={isOpen} preventScroll={false}>
	<Dialog.Content class="">
		<Dialog.Title>{$_(title)}</Dialog.Title>
		<Dialog.Close />
		<div class="*: container">
			<p class="mt-2">
				{$_(text)}
			</p>
		</div>
	</Dialog.Content>
</Dialog.Root>
