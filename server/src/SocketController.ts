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
		private player: Player
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

	private sendToSingleClient<T extends keyof ServerToClientEvents>(
		id: number,
		event: T,
		...data: Parameters<ServerToClientEvents[T]>
	) {
		this.io.to(this.getLobbyChannel() + id).emit(event, ...data);
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
		const playerGroup = this.lobby.players;
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
		this.sendToAll('suggestionsUpdate', this.getGame().getState('operative').suggestions);
	}

	private sendPlayerState(): void {
		this.sendToAll('playerUpdate', this.getAllPlayer());
	}
	private sendMyPlayerStatus(): void {
		this.sendToMe('myStatus', this.player);
	}

	// PUBLIC METHODS

	public sync() {
		if (this.player.role === 'spymaster') {
			this.socket.join(this.getSpyMasterChannel());
			this.sendToMe('gameUpdate', this.getGame().getState('spymaster'));
		}
		this.socket.join(this.getLobbyChannel());
		this.socket.join(this.getLobbyChannel() + this.player.id);

		this.player.isConnected = true;
		this.sendGameState();
		this.sendPlayerState();
		this.sendMyPlayerStatus();
	}

	public joinTeamAndRole(team: Team, role: Role) {
		const { success } = this.getGame().setPlayerRole(this.player, role, team);
		if (success) {
			if (role === 'spymaster') {
				this.socket.join(this.getSpyMasterChannel());
				this.sendToMe('gameUpdate', this.getGame().getState('spymaster'));
			} else {
				this.socket.leave(this.getSpyMasterChannel());
			}
			this.sendPlayerState();
		}
	}

	public makeGuess(id: number) {
		const { success } = this.getGame().makeGuess(this.player, id);
		if (success) this.sendGameState();
	}

	public toggleSuggestion(id: number) {
		const { success } = this.getGame().toggleSuggestion(this.player, id);
		if (success) this.sendSuggestions();
	}

	public endGuessing() {
		const { success } = this.getGame().endGuessing(this.player);
		if (success) this.sendGameState();
	}

	public kickPlayer(id: number) {
		if (!this.player.isHost) return;
		const { success } = this.lobby.kickPlayer(id);
		if (success) {
			this.sendToSingleClient(id, 'kick');
			this.sendPlayerState();
		}
	}
	public makeHost(id: number) {
		if (!this.player.isHost) return;
		const { success } = this.lobby.setHost(id);
		if (success) {
			this.sendPlayerState();
		}
	}

	public giveClue(word: string, number: number) {
		const { success } = this.getGame().giveClue(this.player, { clue: word, number });
		if (success) this.sendGameState();
	}

	public startGame() {}

	public handleDisconnect() {
		this.player = {
			...this.player,
			isConnected: true
		};
		this.sendPlayerState();
	}

	public resetGame(): void {
		if (!this.player.isHost) return;
		this.sendGameState();
	}
}
