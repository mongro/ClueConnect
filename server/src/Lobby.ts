import { Game } from './Game';
import { Player } from './types';
import crypto from 'crypto';

export class Lobby {
	id: string;
	game: Game;
	player: Record<string, Player> = {};
	playerLimit: number = 10;
	isLocked: boolean = false;
	IdForNewPlayer: number = 1;

	constructor(id: string) {
		this.id = id;
		this.game = new Game(1, this.player);
	}

	public get isFull(): boolean {
		return this.isLocked || this.playerLimit < Object.keys(this.player).length - 1;
	}

	hasPlayer(credentials: string) {
		return this.player[credentials] !== undefined;
	}

	public addPlayer(name: string): string | undefined {
		if (this.isFull) return undefined;
		const credentials = crypto.randomUUID();
		const playerNew = {
			id: this.IdForNewPlayer++,
			name: name,
			isConnected: true,
			isHost: Object.keys(this.player).length === 0
		};
		this.player[credentials] = playerNew;

		return credentials;
	}

	public getOrAddPlayer(
		credentials: string,
		name?: string
	): { success: boolean; isNew: boolean; player?: Player } {
		if (this.isFull) return { success: false, isNew: false };
		if (this.player[credentials] !== undefined) {
			return { success: true, isNew: false, player: this.player[credentials] };
		}
		const playerNew = {
			id: this.IdForNewPlayer++,
			name: name ?? 'Unknown',
			isConnected: true,
			isHost: Object.keys(this.player).length === 0
		};
		this.player[credentials] = playerNew;

		return { success: true, isNew: true, player: playerNew };
	}
}
