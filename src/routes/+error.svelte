<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="flex h-full w-full flex-col items-center justify-center">
	<div class="flex max-w-2/3 flex-col rounded bg-white p-4 shadow-md">
		<h1 class="text-4xl font-bold">😵‍💫{page.error?.message}</h1>
		<div class="bg-surface-800 mt-4">
			<h1 class="ml-4 text-3xl font-bold text-red-500">{page.status} ERROR</h1>
		</div>
	</div>
</div>
