import { Bot, BotComposition } from './ai/BotRunner';
import { Game } from './Game';
import { Player, Role, Team } from './types';
import crypto from 'crypto';

export class Lobby {
	id: string;
	game: Game;
	players: Record<number, Player> = {};
	bots: BotComposition;
	credentialsToIdMap: Record<string, number> = {};
	playerLimit: number = 10;
	isLocked: boolean = false;
	IdForNewPlayer: number = 0;

	constructor(id: string) {
		this.id = id;
		this.game = new Game(1, this.players);
		this.bots = {
			red: { operative: null, spymaster: null },
			blue: { operative: null, spymaster: null }
		};
	}

	public get isFull(): boolean {
		return this.isLocked || this.playerLimit < Object.keys(this.players).length - 1;
	}

	hasNoConnectedPlayers() {
		return this.playersAll.every((player) => player.isConnected == false);
	}

	hasPlayer(id: number) {
		return this.players[id] !== undefined;
	}

	get playersAll(): Player[] {
		return Object.values(this.players);
	}

	public getPlayerFromCredentials(credentials: string) {
		const id = this.credentialsToIdMap[credentials];
		if (id === undefined) return null;
		return this.players[id];
	}

	public get host() {
		return Object.values(this.players).find((player) => player.isHost);
	}
	public setHost(id: number) {
		const player = this.players[id];
		const currentHost = this.host;
		if (currentHost) currentHost.isHost = false;
		if (player) {
			this.players[id].isHost = true;
			return { success: true };
		} else return { success: false };
	}
	public kickPlayer(id: number) {
		if (this.players[id]) {
			delete this.players[id];
			return { success: true };
		}
		return { success: false };
	}

	addBot(bot: Bot) {
		this.bots[bot.team][bot.role] = bot;
	}

	deleteBot(role: Role, team: Team) {
		this.bots[team][role] = null;
	}

	deleteAllBots() {
		this.bots = {
			red: { operative: null, spymaster: null },
			blue: { operative: null, spymaster: null }
		};
	}

	getActiveBot() {
		if (this.game.gameover || !this.game.hasStarted) return null;
		return this.bots[this.game.currentTeam][this.game.currentClue ? 'operative' : 'spymaster'];
	}

	setBotisThinking(bot: Bot, isThinking: boolean) {
		this.bots[bot.team][bot.role] = { ...bot, isThinking };
	}

	public addPlayer(name: string): string | undefined {
		if (this.isFull) return undefined;
		const credentials = crypto.randomUUID();
		const playerNew = {
			id: this.IdForNewPlayer++,
			name: name,
			isConnected: true,
			isHost: Object.keys(this.players).length === 0
		};
		this.players[playerNew.id] = playerNew;
		this.credentialsToIdMap[credentials] = playerNew.id;

		return credentials;
	}
}
