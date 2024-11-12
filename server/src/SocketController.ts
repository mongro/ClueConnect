import { ClientToServerEvents, ServerToClientEvents } from './types';
import type { Game } from './Game';
import type { Server, Socket } from 'socket.io';
import type { Lobby } from './Lobby';
import { Role, Team, Player } from './types';

const SPYMASTER_CHANNEL = '/spymasters';
const OPERATIVE_CHANNEL = '/operatives';
/**
 * This class is responsible for handling all events for a given socket.
 * It connects the server with the methods in Game class.
 */
export class SocketController {
	constructor(
		private socket: Socket<ClientToServerEvents, ServerToClientEvents, {}, {}>,
		private io: Server<ClientToServerEvents, ServerToClientEvents, {}, {}>,
		private lobby: Lobby,
		private credentials: string
	) {}

	// AUXILIARY PRIVATE METHODS

	private getLobbyChannel() {
		return this.lobby.id;
	}

	private getSpyMasterChannel() {
		return this.lobby.id + SPYMASTER_CHANNEL;
	}
	private sendToAll<T extends keyof ServerToClientEvents>(
		event: T,
		...data: Parameters<ServerToClientEvents[T]>
	): void {
		this.io.to(this.getLobbyChannel()).emit(event, ...data);
	}

	private sendToMe<T extends keyof ServerToClientEvents>(
		event: T,
		...data: Parameters<ServerToClientEvents[T]>
	) {
		this.socket.emit(event, ...data);
	}

	private sendToOthers<T extends keyof ServerToClientEvents>(
		event: T,
		...data: Parameters<ServerToClientEvents[T]>
	) {
		this.socket.broadcast.to(this.getLobbyChannel()).emit(event, ...data);
	}

	private sendToSpyMasters<T extends keyof ServerToClientEvents>(
		event: T,
		...data: Parameters<ServerToClientEvents[T]>
	) {
		this.io.to(this.getSpyMasterChannel()).emit(event, ...data);
	}
	private sendToOperatives<T extends keyof ServerToClientEvents>(
		event: T,
		...data: Parameters<ServerToClientEvents[T]>
	) {
		this.io.to(this.getLobbyChannel()).emit(event, ...data);
	}

	private getAllPlayer(): Player[] {
		const playerGroup = this.lobby.player;
		return Object.values(playerGroup);
	}

	// PRIVATE METHODS

	private getGame(): Game {
		return this.lobby.game;
	}

	private sendGameState(): void {
		this.sendToAll('gameUpdate', this.getGame().getState('operative'));
		this.sendToSpyMasters('gameUpdate', this.getGame().getState('spymaster'));
	}

	private sendSuggestions(): void {
		this.sendToAll('suggestionsUpdate', this.getGame().getSuggestions());
	}

	private sendPlayerState(): void {
		this.sendToAll('playerUpdate', this.getAllPlayer());
	}
	private sendMyPlayerStatus(): void {
		this.sendToMe('myStatus', this.lobby.player[this.credentials]);
	}

	// PUBLIC METHODS

	public sync() {
		let player = this.lobby.player[this.credentials];
		if (player.role === 'spymaster') {
			this.socket.join(this.getSpyMasterChannel());
			this.sendToMe('gameUpdate', this.getGame().getState('spymaster'));
		}
		this.socket.join(this.getLobbyChannel());

		this.lobby.player[this.credentials] = {
			...player,
			isConnected: true
		};
		this.sendGameState();
		this.sendPlayerState();
		this.sendMyPlayerStatus();
	}

	public joinTeamAndRole(team: Team, role: Role) {
		const { success } = this.getGame().setPlayerRole(this.credentials, role, team);
		if (success) {
			if (role === 'spymaster') {
				this.socket.join(this.getSpyMasterChannel());
				this.sendToMe('gameUpdate', this.getGame().getState('spymaster'));
			} else {
				this.socket.leave(this.getSpyMasterChannel());
			}
			this.sendPlayerState();
			this.sendMyPlayerStatus();
		}
	}

	public makeGuess(id: number) {
		const { success } = this.getGame().makeGuess(this.credentials, id);
		if (success) this.sendGameState();
	}

	public toggleSuggestion(id: number) {
		const { success } = this.getGame().toggleSuggestion(this.credentials, id);
		if (success) this.sendSuggestions();
	}

	public endGuessing() {
		const { success } = this.getGame().endGuessing(this.credentials);
		if (success) this.sendGameState();
	}

	public giveClue(word: string, number: number) {
		const { success } = this.getGame().giveClue(this.credentials, { clue: word, number });
		if (success) this.sendGameState();
	}

	public startGame() {}

	public handleDisconnect() {
		this.lobby.player[this.credentials] = {
			...this.lobby.player[this.credentials],
			isConnected: false
		};
		this.sendPlayerState();
	}

	public resetGame(): void {
		if (!this.lobby.player[this.credentials].isHost) return;
		this.sendGameState();
	}
}
