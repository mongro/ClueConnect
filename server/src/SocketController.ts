import { ClientToServerEvents, GameOptions, ServerToClientEvents } from './types';
import type { Game } from './Game';
import type { Server, Socket } from 'socket.io';
import type { Lobby } from './Lobby';
import { Role, Team, Player } from './types';

const SPYMASTER_CHANNEL_KEYWORD = '/spymasters';
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

	private get lobbyChannel() {
		return this.lobby.id;
	}

	private get isHost() {
		return this.player.isHost;
	}

	private get spymasterChannel() {
		return this.lobby.id + SPYMASTER_CHANNEL_KEYWORD;
	}
	private sendToAll<T extends keyof ServerToClientEvents>(
		event: T,
		...data: Parameters<ServerToClientEvents[T]>
	): void {
		this.io.to(this.lobbyChannel).emit(event, ...data);
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
		this.io.to(this.lobbyChannel + id).emit(event, ...data);
	}

	private sendToOthers<T extends keyof ServerToClientEvents>(
		event: T,
		...data: Parameters<ServerToClientEvents[T]>
	) {
		this.socket.broadcast.to(this.lobbyChannel).emit(event, ...data);
	}

	private sendToSpyMasters<T extends keyof ServerToClientEvents>(
		event: T,
		...data: Parameters<ServerToClientEvents[T]>
	) {
		this.io.to(this.spymasterChannel).emit(event, ...data);
	}
	private sendToOperatives<T extends keyof ServerToClientEvents>(
		event: T,
		...data: Parameters<ServerToClientEvents[T]>
	) {
		this.io.to(this.lobbyChannel).emit(event, ...data);
	}

	private getAllPlayer(): Player[] {
		const playerGroup = this.lobby.players;
		return Object.values(playerGroup);
	}

	// PRIVATE METHODS

	get game(): Game {
		return this.lobby.game;
	}

	private sendGameState(): void {
		this.sendToAll('gameUpdate', this.game.getState('operative'));
		this.sendToSpyMasters('gameUpdate', this.game.getState('spymaster'));
	}

	private sendSuggestions(): void {
		this.sendToAll('suggestionsUpdate', this.game.getState('operative').suggestions);
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
			this.socket.join(this.spymasterChannel);
			this.sendToMe('gameUpdate', this.game.getState('spymaster'));
		}
		this.socket.join(this.lobbyChannel);
		this.socket.join(this.lobbyChannel + this.player.id);

		this.player.isConnected = true;
		this.sendGameState();
		this.sendPlayerState();
		this.sendMyPlayerStatus();
	}

	public joinTeamAndRole(team: Team, role: Role) {
		const { success } = this.game.setPlayerRole(this.player, role, team);
		if (success) {
			if (role === 'spymaster') {
				this.socket.join(this.spymasterChannel);
				this.sendToMe('gameUpdate', this.game.getState('spymaster'));
			} else {
				this.socket.leave(this.spymasterChannel);
			}
			this.sendPlayerState();
		}
	}

	public makeGuess(id: number) {
		const { success } = this.game.makeGuess(this.player, id);
		if (success) this.sendGameState();
	}

	public toggleSuggestion(id: number) {
		const { success } = this.game.toggleSuggestion(this.player, id);
		if (success) this.sendSuggestions();
	}

	public endGuessing() {
		const { success } = this.game.endGuessing(this.player);
		if (success) this.sendGameState();
	}

	public kickPlayer(id: number) {
		if (!this.isHost) return;
		const { success } = this.lobby.kickPlayer(id);
		if (success) {
			this.sendToSingleClient(id, 'kick');
			this.sendPlayerState();
		}
	}
	public makeHost(id: number) {
		if (!this.isHost) return;
		const { success } = this.lobby.setHost(id);
		if (success) {
			this.sendPlayerState();
		}
	}

	public giveClue(word: string, number: number) {
		const { success } = this.game.giveClue(this.player, { clue: word, number });
		if (success) this.sendGameState();
	}

	public handleDisconnect() {
		this.player.isConnected = false;
		this.sendPlayerState();
	}

	public startGame(options: Partial<GameOptions> = {}): void {
		if (!this.isHost) return;
		console.log('optController', options);
		this.game.startGame(options);
		this.io.socketsLeave(this.spymasterChannel);
		this.sendGameState();
		this.sendPlayerState();
	}

	public resetGame(): void {
		if (!this.isHost) return;
		this.game.resetGame();
		this.io.socketsLeave(this.spymasterChannel);

		this.sendGameState();
		this.sendPlayerState();
	}
	public resetTeams(): void {
		if (!this.isHost) return;
		this.io.socketsLeave(this.spymasterChannel);
		this.game.resetTeams();
		this.sendPlayerState();
	}
}
