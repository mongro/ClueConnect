import { Game } from './Game';
import { Player } from './types';
import crypto from 'crypto';

export class Lobby {
	id: string;
	game: Game;
	players: Record<number, Player> = {};
	credentialsToIdMap: Record<string, number> = {};
	playerLimit: number = 10;
	isLocked: boolean = false;
	IdForNewPlayer: number = 0;

	constructor(id: string) {
		this.id = id;
		this.game = new Game(1, this.players);
	}

	public get isFull(): boolean {
		return this.isLocked || this.playerLimit < Object.keys(this.players).length - 1;
	}

	hasPlayer(id: number) {
		return this.players[id] !== undefined;
	}

	public getPlayerFromCredentials(credentials: string) {
		const id = this.credentialsToIdMap[credentials];
		if (id === undefined) return null;
		return this.players[id];
	}

	public kickPlayer(id: number) {
		if (this.players[id]) {
			delete this.players[id];
			return { success: true };
		}
		return { success: false };
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
