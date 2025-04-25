import { ClientToServerEvents, GameOptions, ServerToClientEvents } from './types';
import type { Game } from './Game';
import type { Server, Socket } from 'socket.io';
import type { Lobby } from './Lobby';
import { Role, Team, Player } from './types';
import { createBotGuesser, createBotSpymaster } from './ai/createBot';
import { Bot, BotRunner } from './ai/BotRunner';

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

	private get isHost() {
		return this.player.isHost;
	}

	private get lobbyChannel() {
		return this.lobby.id;
	}

	private get spymasterChannel() {
		return this.lobby.id + SPYMASTER_CHANNEL_KEYWORD;
	}

	private get userChannel() {
		return this.lobbyChannel + '/' + this.player.id;
	}

	async moveSocketsToRoom(from: string, to: string): Promise<void> {
		const sockets = await this.io.in(from).fetchSockets();
		for (const socket of sockets) {
			socket.leave(from);
			socket.join(to);
		}
	}

	private sendToAll<T extends keyof ServerToClientEvents>(
		event: T,
		...data: Parameters<ServerToClientEvents[T]>
	): void {
		this.io
			.to(this.lobbyChannel)
			.to(this.spymasterChannel)
			.emit(event, ...data);
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

	private sendToSpyMasters<T extends keyof ServerToClientEvents>(
		event: T,
		...data: Parameters<ServerToClientEvents[T]>
	) {
		this.io.to(this.spymasterChannel).emit(event, ...data);
	}

	private sendToNotSpyMasters<T extends keyof ServerToClientEvents>(
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
		this.sendToNotSpyMasters('gameUpdate', this.game.getState('operative'));
		this.sendToSpyMasters('gameUpdate', this.game.getState('spymaster'));
	}

	private sendSuggestions(): void {
		this.sendToAll('suggestionsUpdate', this.game.getState('operative').suggestions);
	}

	private sendPlayerState(): void {
		this.sendToAll('playerUpdate', this.getAllPlayer());
	}

	private sendBotState(): void {
		this.sendToAll('botUpdate', this.lobby.bots);
	}
	private sendMyPlayerStatus(): void {
		this.sendToMe('myStatus', this.player);
	}

	// PUBLIC METHODS

	public async sync() {
		this.socket.join(this.userChannel);

		if (this.player.role === 'spymaster') {
			this.socket.join(this.spymasterChannel);
		} else {
			this.socket.join(this.lobbyChannel);
		}

		this.player.isConnected = true;
		this.sendGameState();
		this.sendBotState();
		this.sendPlayerState();
		this.sendMyPlayerStatus();

		//If first player joins lobby, start loop that controls bot behaviour
		if (this.lobby.playersAll.length == 1) {
			const botRunner = new BotRunner(this.lobby, this.sendToAll.bind(this), {
				delay: 2000,
				batchUpdates: false,
				onGameChange: this.sendGameState.bind(this)
			});
			botRunner.run();
		}
	}

	public joinTeamAndRole(team: Team, role: Role) {
		const { success } = this.game.setPlayerRole(this.player, role, team);
		if (success) {
			if (role === 'spymaster') {
				this.socket.join(this.spymasterChannel);
				this.socket.leave(this.lobbyChannel);
				this.sendToMe('gameUpdate', this.game.getState('spymaster'));
			} else {
				this.socket.leave(this.spymasterChannel);
				this.socket.join(this.lobbyChannel);
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

	public async handleDisconnect() {
		const matchingSockets = await this.io.in(this.userChannel).fetchSockets();
		const isDisconnected = matchingSockets.length === 0;
		if (isDisconnected) {
			this.player.isConnected = false;
			this.sendPlayerState();
		}
	}

	public startGame(options: Partial<GameOptions> = {}): void {
		if (!this.isHost) return;
		this.game.startGame(options);
		this.sendGameState();
		this.sendPlayerState();
	}

	public resetGame(): void {
		if (!this.isHost) return;
		this.game.resetGame();
		this.moveSocketsToRoom(this.spymasterChannel, this.lobbyChannel);
		this.sendGameState();
		this.sendPlayerState();
	}
	public resetTeams(): void {
		if (!this.isHost) return;
		this.moveSocketsToRoom(this.spymasterChannel, this.lobbyChannel);

		this.game.resetTeams();
		this.sendPlayerState();
	}

	public addBot(bot: Bot) {
		this.lobby.addBot(bot);
		this.sendBotState();
	}
	public deleteBot(role: Role, team: Team) {
		this.lobby.deleteBot(role, team);
		this.sendBotState();
	}
}
