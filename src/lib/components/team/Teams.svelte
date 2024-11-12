<script lang="ts">
	import type { Player, Role, Team, TeamComposition } from '$shared/src/types';
	import TeamDisplay from './Team.svelte';

	interface Props {
		score: { blue: number; red: number };
		myState: Player;
		teams: TeamComposition;
	}

	let { score, myState, teams }: Props = $props();
</script>

<div class="flex flex-col gap-4">
	<TeamDisplay
		team="red"
		score={score.red}
		spymaster={teams.red.spymaster}
		operative={teams.red.operative}
		{myState}
	/>
	<TeamDisplay
		team="blue"
		score={score.blue}
		spymaster={teams.blue.spymaster}
		operative={teams.blue.operative}
		{myState}
	/>
</div>
