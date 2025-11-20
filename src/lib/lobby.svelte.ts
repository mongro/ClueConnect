import type { GameState, Player, Role, Team, TeamComposition } from '$shared/src/types';
import { getContext, hasContext, setContext } from 'svelte';
import socket from './socket';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';
import { LocalStorageHelper } from './components/LocalStorageHelper';
import type { BotComposition } from '$shared/src/ai/BotRunner';
import { ModalManager } from './modalManager.svelte';

class LobbyState {
	id: string;
	players = $state<Player[]>([]);
	bots = $state<BotComposition>({
		red: { operative: null, spymaster: null },
		blue: { operative: null, spymaster: null }
	});
	gameState = $state<GameState>();
	credentials = $state<string>();
	myState = $state<Player | undefined>();
	modalManager: ModalManager;
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

	constructor(
		id: string,
		players: Player[] = [],
		game: GameState,
		modalManager: ModalManager,
		myState?: Player
	) {
		this.id = id;
		this.players = players;
		this.gameState = game;
		this.myState = myState;
		this.modalManager = modalManager;
		this.credentials = browser ? LocalStorageHelper.getLobbyEntry(id) : '';
		socket.on('playerUpdate', (serverPlayerState) => {
			this.players = serverPlayerState;
			if (this.myState) {
				const myId = this.myState.id;
				const myStateUpdate = serverPlayerState.find((player) => player.id === myId);
				if (myStateUpdate) this.myState = myStateUpdate;
			}
		});
		socket.on('botUpdate', (bots) => {
			this.bots = bots;
		});
		socket.on('errorMessage', (error) => {
			if (error.status === 429) {
				this.bots = {
					red: { operative: null, spymaster: null },
					blue: { operative: null, spymaster: null }
				};
				this.modalManager.open(
					'Bots are currently not working',
					'Reason: The rate limit for requests to the openAi api is reached.  '
				);
			}
			if (error.status === 503) {
				this.bots = {
					red: { operative: null, spymaster: null },
					blue: { operative: null, spymaster: null }
				};
				this.modalManager.open(
					'Bots are currently not working',
					'Reason: OpenAi servers are experiencing high traffic. '
				);
			}
		});

		socket.on('myStatus', (serverMyState) => {
			this.myState = serverMyState;
			this.isConnectingToLobby = false;
		});

		socket.on('disconnect', function () {});
		socket.on('connect', function () {});
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

	myRoleIs(team: Team, role: Role) {
		return this.myRole == role && this.myTeam == team;
	}

	hasSeenAllCardTypes() {
		return this.myRole == 'spymaster' && this.hasStarted();
	}

	hasBot(team: Team, role: Role) {
		return this.bots[team][role];
	}

	getMembers(team: Team, role: Role) {
		return this.teams[team][role];
	}

	hasHumanMembers(team: Team, role: Role) {
		return this.teams[team][role].length > 0;
	}

	hasMembers(team: Team, role: Role) {
		return this.hasHumanMembers(team, role) || this.hasBot(team, role);
	}

	hasStarted() {
		return this.gameState?.board?.length && this.gameState.board.length > 0;
	}

	connect() {
		if (!this.credentials) return;
		socket.connect();
		socket.emit('joinLobby', this.id, this.credentials);
		this.isConnectingToLobby = true;
	}
}

const KEY = 'lobby';
export function setLobbyState(
	id: string,
	players: Player[] = [],
	game: GameState,
	modalManager: ModalManager
) {
	return setContext(KEY, new LobbyState(id, players, game, modalManager));
}

export function getLobbyState() {
	if (hasContext(KEY)) {
		return getContext<ReturnType<typeof setLobbyState>>(KEY);
	} else throw 'Context not found.';
}
