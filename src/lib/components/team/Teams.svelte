<script lang="ts">
	import type { Player, Role, Team, TeamComposition } from '$shared/src/types';
	import TeamDisplay from './Team.svelte';

	interface Props {
		score: { blue: number; red: number };
		joinRoleAndTeam: (role: Role, team: Team) => void;
		myState: Player;
		teams: TeamComposition;
	}

	let { score, joinRoleAndTeam, myState, teams }: Props = $props();
</script>

<div class="flex flex-col gap-4">
	<TeamDisplay
		team="red"
		score={score.red}
		spymaster={teams.red.spymaster}
		operative={teams.red.operative}
		joinRole={(role: Role) => joinRoleAndTeam(role, 'red')}
		{myState}
	/>
	<TeamDisplay
		team="blue"
		score={score.blue}
		spymaster={teams.blue.spymaster}
		operative={teams.blue.operative}
		joinRole={(role: Role) => joinRoleAndTeam(role, 'blue')}
		{myState}
	/>
</div>
