<script lang="ts">
	import type { Role, Team } from '$shared/src/types';

	interface Props {
		currentTeam: Team;
		myTeam: Team | undefined;
		myRole: Role | undefined;
		inGuessPhase: boolean;
		winner: Team | null;
	}

	let { currentTeam, myTeam, myRole, inGuessPhase, winner }: Props = $props();
	function createMessage() {
		if (winner) {
			return `The ${winner} team wins!`;
		}
		if (myTeam === undefined) {
			return `The ${currentTeam} ${inGuessPhase ? 'operative' : 'spymaster'} is playing. To play, join a team.`;
		}
		if (currentTeam === myTeam) {
			if (myRole === 'spymaster' && inGuessPhase) return 'Your operative is guessing now';
			if (myRole === 'operative' && inGuessPhase) return 'Make a guess now';
			if (myRole === 'spymaster' && !inGuessPhase) return 'Give a clue to your operatives.';
			if (myRole === 'operative' && !inGuessPhase) return 'Wait for your spymaster to give a clue';
		}
		if (inGuessPhase) return 'The opponent operatives are guessing. Wait for your turn.';
		else return 'The opponent spymaster is preparing a clue. Wait for your turn.';
	}
</script>

<div class="flex items-center justify-center">
	<div class="rounded bg-white px-2 py-2 text-center text-2xl">
		{createMessage()}
	</div>
</div>
