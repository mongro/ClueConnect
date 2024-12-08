import type { GameState, Player, Role, Team, TeamComposition } from '$shared/src/types';
import { getContext, hasContext, setContext } from 'svelte';
import socket from './socket';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';
import { LocalStorageHelper } from './components/LocalStorageHelper';

class LobbyState {
	id: string;
	players = $state<Player[]>([]);
	gameState = $state<GameState>();
	credentials = $state<string>();
	myState = $state<Player | undefined>();
	isConnectingToLobby = $state<boolean>(false);
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

	constructor(id: string, players: Player[] = [], game: GameState, myState?: Player) {
		this.id = id;
		this.players = players;
		this.gameState = game;
		this.myState = myState;
		this.credentials = browser ? LocalStorageHelper.getLobbyEntry(id) : '';
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
			this.isConnectingToLobby = false;
		});

		socket.on('disconnect', function () {
			console.log('disconnect');
			console.log('disconnect', socket.id);
		});
		socket.on('connect', function () {
			console.log('connect');
			console.log('id', Date.now().toLocaleString('de'), socket.id, browser ? 'browser' : 'server');
		});
		socket.on('suggestionsUpdate', (serverSuggestionsState) => {
			if (this.gameState) this.gameState.suggestions = serverSuggestionsState;
		});
		socket.on('gameUpdate', (serverGameState) => {
			this.gameState = serverGameState;
			console.log('gameUpdate', serverGameState);
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

	connect() {
		if (!this.credentials) return;
		socket.connect();
		socket.emit('joinLobby', this.id, this.credentials);
		this.isConnectingToLobby = true;
	}
}

const KEY = 'lobby';
export function setLobbyState(id: string, players: Player[] = [], game: GameState) {
	return setContext(KEY, new LobbyState(id, players, game));
}

export function getLobbyState() {
	if (hasContext(KEY)) {
		return getContext<ReturnType<typeof setLobbyState>>(KEY);
	} else throw 'Context not found.';
}
