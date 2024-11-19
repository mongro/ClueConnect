import type { Player, Role, Team, TeamComposition } from '$shared/src/types';
import socket from './socket';

class LobbyState {
	players: Player[] = $state([]);
	myState = $state<Player | null>(null);
	teams = $derived.by(() => {
		let result: TeamComposition = {
			red: { operative: [], spymaster: [] },
			blue: { operative: [], spymaster: [] }
		};
		for (let i = 0; i < this.players.length; i++) {
			const { role, team } = this.players[i];
			if (team && role) {
				result[team][role].push(this.players[i]);
			}
		}
		return result;
	});

	constructor() {
		socket.on('playerUpdate', (serverPlayerState) => {
			console.log('playerUpdate', serverPlayerState);
			this.players = serverPlayerState;
			if (this.myState) {
				const myId = this.myState.id;
				const myStateUpdate = serverPlayerState.find((player) => player.id === myId);
				if (myStateUpdate) this.myState = myStateUpdate;
			}
		});

		socket.on('myStatus', (serverMyState) => {
			this.myState = serverMyState;
		});
	}

	get myTeam() {
		return this.myState?.team;
	}

	get myRole() {
		return this.myState?.role;
	}

	getMembers(team: Team, role: Role) {
		return this.teams[team][role];
	}
}
export const lobby = new LobbyState();
