<script lang="ts">
	import type { Player, Role, Team, TeamComposition } from '$shared/src/types';
	import TeamDisplay from './Team.svelte';

	interface Props {
		score: { blue: number; red: number };
	}

	let { score }: Props = $props();
</script>

<div
	class="col-span-2 row-start-2 flex h-full flex-col gap-4 overflow-y-scroll pb-2 sm:overflow-visible lg:col-span-1 lg:col-start-1 lg:row-start-1"
>
	<TeamDisplay team="red" score={score.red} />
	<TeamDisplay team="blue" score={score.blue} />
</div>
