import type { GameState, Player, Role, Team, TeamComposition } from '$shared/src/types';
import { getContext, setContext } from 'svelte';
import socket from './socket';
import { goto } from '$app/navigation';

class LobbyState {
	players: Player[] = $state([]);
	gameState: GameState | null = $state(null);
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

	constructor(players: Player[] = [], game: GameState, myState?: Player) {
		this.players = players;
		this.gameState = game;
		this.myState = myState ?? null;
		socket.on('playerUpdate', (serverPlayerState) => {
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

		socket.on('disconnect', function () {
			console.log('disconnect');
		});
		socket.on('connect', function () {
			console.log('connect');
		});
		socket.on('suggestionsUpdate', (serverSuggestionsState) => {
			if (this.gameState) this.gameState.suggestions = serverSuggestionsState;
		});
		socket.on('gameUpdate', (serverGameState) => {
			this.gameState = serverGameState;
		});

		socket.on('kick', () => {
			goto('/');
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

const KEY = 'lobby';
export function setLobbyState(players: Player[] = [], game: GameState) {
	return setContext(KEY, new LobbyState(players, game));
}

export function getLobbyState() {
	return getContext<ReturnType<typeof setLobbyState>>(KEY);
}
//export const lobby = new LobbyState(players: Player[] = [], game: GameState);
