<script lang="ts">
	import type { Player, Role, Team, TeamComposition } from '$shared/src/types';
	import TeamDisplay from './Team.svelte';

	interface Props {
		score: { blue: number; red: number };
	}

	let { score }: Props = $props();
</script>

<div
	class="col-span-5 row-start-2 grid grid-cols-2 gap-4 pb-2 lg:col-span-1 lg:col-start-1 lg:row-start-1 lg:grid-cols-1"
>
	<TeamDisplay team="red" score={score.red} />
	<TeamDisplay team="blue" score={score.blue} />
</div>
